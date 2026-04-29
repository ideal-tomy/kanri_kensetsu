import type { AlertNotification, KnowledgeItem } from "@/types/domain";

export const alertNotifications: AlertNotification[] = [
  {
    id: "al1",
    projectId: "p2",
    title: "施工不良の可能性",
    message: "扉下端の隙間が規定値を超過している可能性があります",
    level: "critical",
    createdAt: "2026-04-29T10:13:00+09:00",
    isRead: false,
    source: "ai",
    linkedDefectReportId: "df1",
  },
  {
    id: "al2",
    projectId: "p1",
    title: "安全書類の提出期限",
    message: "KY活動報告が未提出です",
    level: "warning",
    createdAt: "2026-04-29T09:00:00+09:00",
    isRead: true,
    source: "manual",
  },
];

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: "k1",
    title: "建具取付時の傷防止チェック",
    category: "品質",
    updatedAt: "2026-04-20",
    summary: "搬入〜取付までの傷防止チェックリスト",
  },
];
