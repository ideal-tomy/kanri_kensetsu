# Supabase 移行手順 (Phase 2)

## 概要

`prototype-store`（メモリ）→ Supabase（永続化＋Realtime）への shadow write 方式の移行手順。
**未設定でもアプリは動く**（prototype-store フォールバック）。デモ環境を壊さずに段階移行できる。

## 1. 前提

- 必要なものは導入済み:
  - `@supabase/supabase-js` / `@supabase/ssr`
  - `[supabase/migrations/](supabase/migrations/)` 配下のSQL
  - `[src/lib/supabase/](src/lib/supabase/)` クライアントラッパ
  - `[src/lib/db/](src/lib/db/)` アブストラクション層
  - `[src/lib/hooks/useRealtimePhotos.ts](src/lib/hooks/useRealtimePhotos.ts)` Realtime フック

## 2. Supabase プロジェクトを作る

1. https://app.supabase.com で新規プロジェクト作成（Region: Tokyo / ap-northeast-1 推奨）
2. SQL Editor で `[supabase/migrations/](supabase/migrations/)` 配下のSQLを **0001 → 0005 の順** に実行
3. Authentication → URL Configuration の Site URL に `http://localhost:3000` を追加

## 3. 環境変数を設定

`[.env.example](.env.example)` を `.env.local` にコピーして値を入れる:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...   # ← サーバー用
```

未設定の場合は `[src/lib/supabase/config.ts](src/lib/supabase/config.ts)` の `isSupabaseConfigured` が `false` になり、shadow write / Realtime は黙って no-op になる。

## 4. ID 統一マッピング (T2-02)

`mock/projects.id = "p1"` と `prototype-store/sites.id = "site-1"` を Supabase 上の `uuid` に集約する。

```sql
-- 例: マッピングの登録
insert into migration_id_map (legacy_id, new_id, source)
values
  ('p1',     gen_random_uuid(), 'mock_project'),
  ('site-1', (select new_id from migration_id_map where legacy_id = 'p1'), 'prototype_site');
```

このマッピングを使って既存データを変換し、最終的に `mock/projects` と `prototype-store/sites` を Supabase の単一 `sites` テーブルに統合する。

## 5. shadow write の有効化 (T2-04)

`[src/app/api/photos/route.ts](src/app/api/photos/route.ts)` の `POST` で `shadowInsertPhotoReport(photo)` が呼ばれている。
環境変数を設定すると自動的に Supabase へ書き込まれる。失敗してもアプリは止まらない（catch でログのみ）。

注意: 現状 `siteId` が UUID でない場合（例 `site-1`）はスキップされる。
`migration_id_map` を引いて変換するロジックを `[src/lib/db/photo-reports.ts](src/lib/db/photo-reports.ts)` に追加すれば段階移行可能。

## 6. 読み込みを Supabase に切替 (T2-05)

ページ側の import を変えるだけ:

```diff
- import { getPhotoReportsForUser } from "@/lib/prototype-store";
+ import { getPhotoReportsForUser } from "@/lib/db";
```

`[src/lib/db/photo-reports.ts](src/lib/db/photo-reports.ts)` は Supabase 設定時のみ Supabase を読み、
それ以外は prototype-store にフォールバックする。

切替対象（Phase 1 で接続済みのページ）:

- `[src/app/admin/field-reports/page.tsx](src/app/admin/field-reports/page.tsx)`
- `[src/app/admin/reports/photos/page.tsx](src/app/admin/reports/photos/page.tsx)`
- `[src/app/m/supervisor/photo/page.tsx](src/app/m/supervisor/photo/page.tsx)`

## 7. 他テーブルへの展開 (T2-06)

優先順位:

1. `tasks` / `task_updates`（進捗管理）
2. `assignments` / `assignment_changes`（人員配置）
3. `reports` / `notifications`（日報・通知）
4. `sites` / `site_progress_logs`

各テーブル単位で:

- スキーマは既に `[supabase/migrations/](supabase/migrations/)` にある
- shadow write 関数を `[src/lib/db/](src/lib/db/)` に追加
- API ルートで shadow write を呼ぶ
- ページの import を `@/lib/db` に切替

## 8. Realtime 化 (T2-07)

写真は `[src/lib/hooks/useRealtimePhotos.ts](src/lib/hooks/useRealtimePhotos.ts)` 経由で `[src/components/viz/LivePhotoGalleryGrid.tsx](src/components/viz/LivePhotoGalleryGrid.tsx)` ラッパが用意済み。
Supabase Studio で対象テーブルの Realtime を有効化:

```
Database → Replication → photo_reports → ON
```

ページ側で `PhotoGalleryGrid` を `LivePhotoGalleryGrid` に置き換えるだけで、
別タブ投稿が自動反映される（環境変数未設定時は通常表示にフォールバック）。

## 9. 動作確認チェックリスト

- [ ] `.env.local` を設定 → `npm run dev` で起動
- [ ] ワーカーで写真投稿
- [ ] Supabase Studio の `photo_reports` テーブルに行が増える
- [ ] 別タブで `/admin/field-reports` を開いた状態で投稿 → 自動更新
- [ ] `.env.local` を削除しても起動 → prototype-store のみで動く

## 10. ロールバック

Supabase 側に問題が発生した場合:

1. `.env.local` を空にして再起動 → 即座に prototype-store にフォールバック
2. 必要に応じて `[src/app/api/photos/route.ts](src/app/api/photos/route.ts)` の shadow write 行を一時的にコメントアウト
3. 落ち着いてから ID マッピング・スキーマを修正
