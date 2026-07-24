# kanri_kensetsu（GENPO 現場オペデモ）

建設ハブ Demo③（現場オペ画面）。Next.js App Router。

## 起動

```bash
cd kanri_kensetsu
npm install
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login).

デモアカウント例:

- 田中さん（現場）
- 伊藤監督（現場監督）
- 中村花子（内勤管理）

## 環境変数

`.env.example` を参照。

| 変数 | 用途 |
|------|------|
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | 日報・写真メタ・管理者通知の永続化（**Vercel 本番で必須**） |
| `BLOB_READ_WRITE_TOKEN` | 任意。端末からの画像アップロード |
| Supabase 系 | Phase 2（任意・未設定でもデモ可） |

## デモ手順（投稿 → 管理画面）

1. `/login` → **田中さん**
2. `/m/worker` → 報告・連絡 → 定例 or 進捗
3. サンプル画像を選んで写真投稿、またはテキスト報告を送信
4. `/login` → **中村花子** → `/admin`
5. 「最新の動き」の通知／日報を開き、全文と関連写真を確認

### 監督 → 報告書プレビュー

1. `/login` → **伊藤監督**
2. 日報タブ → 「サンプル文を挿入」→「日報を生成」で帳票プレビュー
3. 「送信」後、管理画面の日報詳細でも同じ本文を確認
4. `/admin/reports/output` でテンプレ「作業報告書（外壁等）」からも PDF 出力可能

## Supabase マイグレーション

`supabase/migrations/` に SQL を同梱。現状は同梱のみ。接続後に `supabase db push` 等で適用。
