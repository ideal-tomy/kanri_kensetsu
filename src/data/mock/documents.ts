import type { GeneratedReportPreview, LaborCostLine } from "@/types/domain";

export const generatedReportPreviews: GeneratedReportPreview[] = [
  {
    id: "grp1",
    projectId: "p1",
    kind: "site_daily",
    title: "現場報告書（日次）下書き",
    rawInputSummary:
      "音声: 「A棟3F建具6枚、午後是正1件」／写真タグ: 完了・建具取付",
    aiExpandedDraft:
      "【作業内容】本日、A棟3階において建具6枚の取付を実施しました。午後は既設枠まわりの是正を1件完了し、品質確認まで行いました。\n【安全】朝礼・KY実施済み。異常なし。\n【使用材料】（要確認）",
    reviewChecklist: [
      "使用材料の品番・数量を現場メモと照合",
      "是正箇所の写真を別途添付",
      "協力会社担当者名の表記",
    ],
  },
  {
    id: "grp2",
    projectId: "p5",
    kind: "completion",
    title: "完工報告書（ドラフト）",
    rawInputSummary: "案件ステータス: 完了／引渡し日: 2026-03-31",
    aiExpandedDraft:
      "【概要】豊洲医療モール改装工事について、契約範囲内の工事を完了し、2026年3月31日付で引渡しを行いました。\n【残務】保証書送付は事務所対応（要確認）。",
    reviewChecklist: [
      "発注者承認印の有無",
      "添付図面の最終版番号",
      "不具合・手直し履歴の反映",
    ],
  },
  {
    id: "grp3",
    projectId: "p1",
    kind: "labor_summary",
    title: "労務費サマリー（AI集計イメージ）",
    rawInputSummary: "人日集計: 職長1・一般3（当月）",
    aiExpandedDraft:
      "当月の投入人日は職長相当1.0人月、一般作業員相当12.5人日です。単価テーブルに基づき概算を算出しています（デモ）。",
    reviewChecklist: [
      "残業・深夜の別途単価",
      "協力会社請求との突合",
      "社会保険・諸経費の計上方法",
    ],
  },
];

export const laborCostLines: LaborCostLine[] = [
  {
    id: "lc1",
    projectId: "p1",
    roleLabel: "職長・代理人",
    personDays: 18.5,
    unitCostYen: 42000,
  },
  {
    id: "lc2",
    projectId: "p1",
    roleLabel: "一般作業員",
    personDays: 112,
    unitCostYen: 28000,
  },
  {
    id: "lc3",
    projectId: "p2",
    roleLabel: "一般作業員",
    personDays: 64,
    unitCostYen: 28000,
  },
];
