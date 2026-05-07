# 商談デモ シナリオ集

商談先の業務イメージ・規模・関心事に応じて使い分ける 4 シナリオ。
それぞれ `seed/` 配下にプリセットを用意しており、`scripts/seed-switch.ts` で切り替える。

## シナリオ A: 山田建設工業（戸建リフォーム中心・職人 8 名）

**ターゲット**: 中小建設会社 / 戸建メイン / スマホ操作前提
**メインスクリーン**: ワーカーログイン → 写真投稿 → `/admin` ダッシュボード

### デモストーリー (約 5 分)

1. ワーカー（田中さん）のスマホで現場到着 → 「定例報告」写真送信
2. 監督（伊藤監督）の `/m/supervisor/photo` で即座に表示
3. `/admin` ダッシュボードを開いて、StatCard が「+1」されていることを示す
4. PhotoGalleryGrid に最新写真が並び、現場別 BarChart が更新

### 推し機能

- 進捗写真の自動命名・カテゴリ分類
- 現場ごとの ProgressRing で「全体把握→個別現場」の流れ
- 経営者ロール（owner）でのダッシュボード共有

### シード

`seed/yamada/`：3現場・8人員・写真投稿が活発（定例多め）

---

## シナリオ B: 佐藤工務店（ビル改修・広域・夜勤あり）

**ターゲット**: 中堅ゼネコン / 改修案件多め / 配員調整の頻度高
**メインスクリーン**: `/admin/assignments` → `/admin/projects/[id]` → `/admin/dispatch`

### デモストーリー (約 7 分)

1. `/admin/assignments` の WeekCalendar で「夜勤＋日勤の混在」を見せる
2. 配員アラーム（FutureFeatureBadge 内）で「履歴照合 AI」を訴求
3. `/admin/dispatch` の KanbanBoard で「要フォロー」案件をハイライト
4. `/admin/projects/[id]` の Gantt + ライブタスクで実績確認
5. `/admin/billing` の月次推移で「経営報告」シーンを演出

### 推し機能

- 週カレンダーの夜勤色分け
- KanbanBoard でのドラッグ移動（将来）
- ライブタスクと Gantt の併記

### シード

`seed/sato/`：5現場・15人員・夜勤シフト含む・配員変更履歴あり

---

## シナリオ C: 安全管理重視（書類提出 100% を目指す元請）

**ターゲット**: 安全衛生に厳しい元請ゼネコン / 監査対応の重視
**メインスクリーン**: `/admin/safety-docs` → `/admin/alerts` → `/admin/documents`

### デモストーリー (約 4 分)

1. `/admin/safety-docs` の ProgressRing 群で「提出率の見える化」
2. 未提出警告リストから具体ケースへ誘導
3. `/admin/alerts` の AI 検知で「画像解析からの是正提案」を訴求（FutureFeatureBadge 内）
4. `/admin/documents` で AI 下書き → 要確認チェックリストの流れ

### 推し機能

- 提出率の即時把握
- アラートの 24h 推移
- AI 下書きの要確認項目を明示する設計（説明責任）

### シード

`seed/safety/`：未提出書類多め・AI 検知アラートが複数

---

## シナリオ D: 経営者ダッシュボード（数字メイン）

**ターゲット**: 社長・本部長 / KPI と推移が見たい / 現場細部は見ない
**メインスクリーン**: `/admin` → `/admin/billing` → `/admin/projects`

### デモストーリー (約 3 分)

1. `/admin` の StatCard 4枚 + AreaSparkline で「今日の状況」を 30 秒で
2. LineChart の「2週間推移」で活動量を見る
3. `/admin/billing` の月次推移＋達成率
4. `/admin/projects` の進捗バーランキングで気になる案件を即特定

### 推し機能

- ダッシュボード一画面ですべての KPI を可視化
- 数字優先のデザイン（細部は隠す）
- 経営判断のための「達成率」「進捗推移」

### シード

`seed/exec/`：完了案件と進行中案件をミックス・売上見込みデータが豊富

---

## シナリオ切替の使い方

```bash
# シナリオ B (佐藤工務店) でデモを起動
npm run seed -- sato
npm run dev
```

`scripts/seed-switch.ts` の詳細は `[scripts/seed-switch.ts](scripts/seed-switch.ts)` を参照。
切替により `[src/lib/prototype-store.ts](src/lib/prototype-store.ts)` の初期 state が差し替わる（メモリのみ）。
