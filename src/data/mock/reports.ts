import type {
  AiLog,
  Blueprint,
  DefectReport,
  ReportPhoto,
  SafetyDocument,
  VoiceReport,
} from "@/types/domain";
import { DEMO_BRAND } from "@/config/demo-brand";

export const reportPhotos: ReportPhoto[] = [
  {
    id: "rp1",
    projectId: "p1",
    uploadedByWorkerId: "w4",
    capturedAt: "2026-04-29T08:22:00+09:00",
    originalFileName: "IMG_1021.jpg",
    renamedFileName: `${DEMO_BRAND.productCode}_新宿現場_20260429_完了.jpg`,
    storagePath: "drive://toyo/p1/20260429/",
    tags: ["完了", "建具取付"],
    aiLabelSummary: "玄関建具の設置完了",
    aiConfidence: 0.94,
  },
  {
    id: "rp2",
    projectId: "p2",
    uploadedByWorkerId: "w6",
    capturedAt: "2026-04-29T10:10:00+09:00",
    originalFileName: "camera_52.jpg",
    renamedFileName: `${DEMO_BRAND.productCode}_大手町現場_20260429_是正前.jpg`,
    storagePath: "drive://toyo/p2/20260429/",
    tags: ["是正前", "傷確認"],
    aiLabelSummary: "枠角部に傷の疑い",
    aiConfidence: 0.89,
  },
];

export const voiceReports: VoiceReport[] = [
  {
    id: "vr1",
    projectId: "p1",
    workerId: "w1",
    recordedAt: "2026-04-29T17:10:00+09:00",
    rawTranscript: "A棟3F建具を6枚取り付け。午後に是正1件。",
    formattedDailyReport:
      "本日A棟3Fで建具6枚を取り付け、午後に是正対応を1件実施しました。",
    durationSec: 43,
  },
];

export const blueprints: Blueprint[] = [
  {
    id: "bp1",
    projectId: "p1",
    title: "A棟 3F 建具詳細図",
    revision: "R3",
    updatedAt: "2026-04-25",
    fileUrl: "/mock/blueprint-a3f-r3.pdf",
  },
  {
    id: "bp2",
    projectId: "p2",
    title: "商業ビル共用部 改修図",
    revision: "R2",
    updatedAt: "2026-04-22",
    fileUrl: "/mock/blueprint-common-r2.pdf",
  },
];

export const defectReports: DefectReport[] = [
  {
    id: "df1",
    projectId: "p2",
    reportedByWorkerId: "w6",
    reportedAt: "2026-04-29T10:30:00+09:00",
    severity: "high",
    description: "扉下端に施工不良の可能性（隙間超過）",
    status: "investigating",
    photoIds: ["rp2"],
  },
];

export const safetyDocuments: SafetyDocument[] = [
  {
    id: "sd1",
    projectId: "p1",
    docType: "入場者記録",
    requiredByDate: "2026-04-29",
    status: "submitted",
  },
  {
    id: "sd2",
    projectId: "p2",
    docType: "KY活動報告",
    requiredByDate: "2026-04-29",
    status: "missing",
  },
];

export const aiLogs: AiLog[] = [
  {
    id: "log1",
    timestamp: "2026-04-29T08:23:00+09:00",
    type: "rename",
    message:
      `AIがファイル名を「${DEMO_BRAND.productCode}_新宿現場_20260429_完了.jpg」に自動変更し、Google Driveへ保存しました`,
    relatedEntityType: "reportPhoto",
    relatedEntityId: "rp1",
  },
  {
    id: "log2",
    timestamp: "2026-04-29T10:12:00+09:00",
    type: "detection",
    message: "施工不良の可能性を検知。現場責任者へ通知しました",
    relatedEntityType: "defectReport",
    relatedEntityId: "df1",
  },
  {
    id: "log3",
    timestamp: "2026-04-29T07:55:00+09:00",
    type: "assignment",
    message:
      "配員候補を照合: 松本 → 大手町オフィスタワー（予定）で履歴メモ inc-w1-1 に該当。配置確認ダイアログを推奨",
    relatedEntityType: "assignment",
    relatedEntityId: "a4",
    meta: { incidentNoteId: "inc-w1-1" },
  },
  {
    id: "log4",
    timestamp: "2026-04-29T17:15:00+09:00",
    type: "summary",
    message:
      "ボイス日報と写真タグから現場報告書の下書き段落を生成（要確認チェックリスト付き）",
    relatedEntityType: "generatedReport",
    relatedEntityId: "grp1",
  },
];
