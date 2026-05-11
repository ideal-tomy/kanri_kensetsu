/**
 * デモ用コピー・ナレーション（外壁・サッシ業）
 */

export const EXTERIOR_SASH_DEMO_TAGLINE =
  "写真の名前も場所も考えさせない。撮る場所だけ押せば、内勤の机の上まで届く。";

export const EXTERIOR_SASH_BEFORE_AFTER = {
  before: [
    "LINE・電話・メールが混在し、誰が何を言ったか残らない",
    "写真はギャラリーにぶら下がるだけ。報告書のどこに貼るか分からない",
    "ファイル名が IMG_0001 のまま。探すのは内勤の仕事になる",
  ],
  after: [
    "「施工前」「取付後」など枠を押して撮るだけで、フォルダとファイル名が自動",
    "不足している写真だけが赤く残り、電話確認が必要な現場だけが浮く",
    "揃った現場からそのまま報告書 PDF へ（ドラフト作成の時間を削減）",
  ],
} as const;

export const EXTERIOR_SASH_DEMO_STEPS = [
  {
    title: "1. 現場員",
    description: "今日の現場を選び、到着 → 作業 → 写真枠を押して撮影するだけ。",
    href: "/demo/exterior-sash/worker",
  },
  {
    title: "2. 内勤",
    description: "写真不足・報告待ち・電話確認が一覧で見える「詰まり解消ボード」。",
    href: "/admin/demo/exterior-sash",
  },
  {
    title: "3. 報告書",
    description: "揃った現場を選んでテンプレから PDF 出力（既存フローへ）。",
    href: "/admin/reports/output",
  },
] as const;
