# Phase 3 PLAN/実装/検証

## Scope
- G-01 横断検索: `/search`, `/api/search`
- A-03 通知: `/settings`, `/api/notifications`, `/api/notifications/subscribe`
- PWA: `public/manifest.json`, `src/app/layout.tsx`

## 実装内容
- キーワード検索APIで日報/進捗を横断検索
- 設定画面に通知購読ボタンと通知一覧を追加
- manifest参照をメタデータに設定

## 検証
### 正常系
1. 「雨天」「中断」で一致する日報/進捗が返る
2. 設定画面で購読ボタン押下時に成功メッセージ表示
3. manifestが`/manifest.json`で取得できる

### 異常系
1. 空クエリで空配列
2. 通知未登録時は空表示
3. 検索結果0件時も画面崩れなし

## 判定
- 検索/通知/PWAのプロトタイプ要件を満たす
- Web Push実配信、オフライン下書きは次イテレーションで強化
