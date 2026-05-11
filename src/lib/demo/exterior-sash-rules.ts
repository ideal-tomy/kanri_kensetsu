/**
 * 外壁・サッシ業向け「写真枠・詰まり」デモ用ルール（参照データ + 集計ヘルパ）
 */

export type PhotoSlotDef = {
  id: string;
  label: string;
  required: boolean;
};

export type PhaseRef = {
  id: string;
  label: string;
};

export type SiteBottleneckKind =
  | "photos_missing"
  | "report_pending"
  | "phone_confirm"
  | "staff_shortage"
  | "material_wait";

export type SiteBottleneck =
  | { kind: "photos_missing"; missingCount: number; labels: string[] }
  | { kind: "report_pending" }
  | { kind: "phone_confirm"; reason: string }
  | { kind: "staff_shortage"; note?: string }
  | { kind: "material_wait"; note?: string };

export type ExteriorSashSiteConfig = {
  id: string;
  shortName: string;
  displayName: string;
  currentPhase: PhaseRef;
  slots: PhotoSlotDef[];
  /** デモ用の追加フラグ（詰まりカテゴリ） */
  demo: {
    reportPending?: boolean;
    needsPhoneConfirm?: boolean;
    phoneReason?: string;
    materialWait?: boolean;
    staffShortage?: boolean;
    note?: string;
  };
};

export const EXTERIOR_SASH_SITE_ORDER = ["site-es-1", "site-es-2", "site-es-3"] as const;

export const EXTERIOR_SASH_SITES: Record<string, ExteriorSashSiteConfig> = {
  "site-es-1": {
    id: "site-es-1",
    shortName: "山田邸",
    displayName: "山田邸 サッシ交換工事",
    currentPhase: { id: "phase-es1-sash", label: "サッシ取付" },
    slots: [
      { id: "before", label: "施工前", required: true },
      { id: "measure", label: "寸法確認", required: true },
      { id: "delivery", label: "搬入状態", required: true },
      { id: "installing", label: "取付中", required: true },
      { id: "after", label: "取付後", required: true },
      { id: "sealing", label: "シーリング", required: true },
      { id: "defect", label: "傷・不具合", required: false },
      { id: "extra", label: "追加工事", required: false },
    ],
    demo: { reportPending: false },
  },
  "site-es-2": {
    id: "site-es-2",
    shortName: "青葉マンション",
    displayName: "青葉マンション 外壁補修",
    currentPhase: { id: "phase-es2-wall", label: "外壁補修" },
    slots: [
      { id: "before", label: "施工前", required: true },
      { id: "during", label: "補修中", required: true },
      { id: "after", label: "施工後", required: true },
      { id: "coating", label: "塗装仕上げ", required: true },
      { id: "defect", label: "不具合記録", required: false },
    ],
    demo: { reportPending: true },
  },
  "site-es-3": {
    id: "site-es-3",
    shortName: "中央ビル",
    displayName: "中央ビル カーテンウォール点検",
    currentPhase: { id: "phase-es3-cw", label: "CW確認" },
    slots: [
      { id: "before", label: "施工前全景", required: true },
      { id: "anchor", label: "アンカー確認", required: true },
      { id: "glass", label: "ガラス面", required: true },
      { id: "seal", label: "シーリング", required: true },
    ],
    demo: {
      needsPhoneConfirm: true,
      phoneReason: "施主立会の可否が未確定（明日午前に折返し待ち）",
    },
  },
};

export function getExteriorSashConfig(siteId: string): ExteriorSashSiteConfig | undefined {
  return EXTERIOR_SASH_SITES[siteId];
}

export function listExteriorSashSiteIds(): string[] {
  return [...EXTERIOR_SASH_SITE_ORDER];
}

/** 自動保存パス用（デモ表示） */
export function buildDemoStoragePath(params: {
  companyFolder?: string;
  siteShort: string;
  phaseLabel: string;
  slotLabel: string;
  date: string;
  fileName: string;
}): string {
  const root = params.companyFolder ?? "外壁サッシ";
  const safe = (s: string) => s.replace(/\s+/g, "_");
  return `/${root}/${safe(params.siteShort)}/${safe(params.phaseLabel)}/${safe(params.slotLabel)}/${params.date}/${params.fileName}`;
}

export function buildAutoFileName(params: {
  date: string;
  siteShort: string;
  phaseLabel: string;
  slotLabel: string;
  userName: string;
}): string {
  const user = params.userName.replace(/さん$/, "").trim() || "作業員";
  const seg = [params.date, params.siteShort, params.phaseLabel, params.slotLabel, user]
    .map((s) => s.replace(/[/\\?%*:|"<>]/g, "_"))
    .join("_");
  return `${seg}.jpg`;
}

export function missingRequiredSlots(
  siteId: string,
  filledSlotIds: Set<string>,
): { missing: PhotoSlotDef[]; required: PhotoSlotDef[] } {
  const cfg = EXTERIOR_SASH_SITES[siteId];
  if (!cfg) return { missing: [], required: [] };
  const required = cfg.slots.filter((s) => s.required);
  const missing = required.filter((s) => !filledSlotIds.has(s.id));
  return { missing, required };
}

export function computeBottlenecks(
  siteId: string,
  filledSlotIds: Set<string>,
): SiteBottleneck[] {
  const cfg = EXTERIOR_SASH_SITES[siteId];
  if (!cfg) return [];
  const out: SiteBottleneck[] = [];
  const { missing } = missingRequiredSlots(siteId, filledSlotIds);
  if (missing.length > 0) {
    out.push({
      kind: "photos_missing",
      missingCount: missing.length,
      labels: missing.map((m) => m.label),
    });
  }
  if (cfg.demo.reportPending) {
    out.push({ kind: "report_pending" });
  }
  if (cfg.demo.needsPhoneConfirm) {
    out.push({
      kind: "phone_confirm",
      reason: cfg.demo.phoneReason ?? "顧客・施主との確認が必要です",
    });
  }
  if (cfg.demo.staffShortage) {
    out.push({ kind: "staff_shortage", note: cfg.demo.note });
  }
  if (cfg.demo.materialWait) {
    out.push({ kind: "material_wait", note: cfg.demo.note });
  }
  return out;
}

export function isReportReady(siteId: string, filledSlotIds: Set<string>): boolean {
  const { missing } = missingRequiredSlots(siteId, filledSlotIds);
  if (missing.length > 0) return false;
  const cfg = EXTERIOR_SASH_SITES[siteId];
  if (!cfg) return false;
  if (cfg.demo.reportPending) return false;
  if (cfg.demo.needsPhoneConfirm) return false;
  return true;
}
