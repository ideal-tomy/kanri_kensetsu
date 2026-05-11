import { state } from "@/lib/prototype-store";
import {
  computeBottlenecks,
  getExteriorSashConfig,
  isReportReady,
  listExteriorSashSiteIds,
  missingRequiredSlots,
  type SiteBottleneck,
} from "@/lib/demo/exterior-sash-rules";
import { getExteriorSashFlow, type ExteriorSashFlowStep } from "@/lib/demo/exterior-sash-flow";

export function filledPhotoSlotIdsForSite(siteId: string): Set<string> {
  return new Set(
    state.photoReports
      .filter((p) => p.siteId === siteId && p.photoSlotId)
      .map((p) => p.photoSlotId as string),
  );
}

export type SiteWorkerPayload = {
  siteId: string;
  displayName: string;
  shortName: string;
  currentPhase: { id: string; label: string };
  flowStep: ExteriorSashFlowStep;
  slots: Array<{
    id: string;
    label: string;
    required: boolean;
    filled: boolean;
  }>;
  bottlenecks: SiteBottleneck[];
  reportReady: boolean;
  missingLabels: string[];
  requiredSlotCount: number;
  recentPhotos: Array<{
    id: string;
    fileName: string;
    storagePath: string;
    slotId?: string;
    createdAt: string;
    userName: string;
  }>;
};

export function buildWorkerPayload(siteId: string): SiteWorkerPayload | null {
  const cfg = getExteriorSashConfig(siteId);
  if (!cfg) return null;
  const filled = filledPhotoSlotIdsForSite(siteId);
  const { missing, required } = missingRequiredSlots(siteId, filled);
  const bottlenecks = computeBottlenecks(siteId, filled);
  const recent = state.photoReports
    .filter((p) => p.siteId === siteId)
    .slice(0, 12)
    .map((p) => ({
      id: p.id,
      fileName: p.fileName,
      storagePath: p.storagePath,
      slotId: p.photoSlotId,
      createdAt: p.createdAt,
      userName: p.userName,
    }));

  return {
    siteId,
    displayName: cfg.displayName,
    shortName: cfg.shortName,
    currentPhase: cfg.currentPhase,
    flowStep: getExteriorSashFlow(siteId),
    slots: cfg.slots.map((s) => ({
      id: s.id,
      label: s.label,
      required: s.required,
      filled: filled.has(s.id),
    })),
    bottlenecks,
    reportReady: isReportReady(siteId, filled),
    missingLabels: missing.map((m) => m.label),
    requiredSlotCount: required.length,
    recentPhotos: recent,
  };
}

export type BoardSiteRow = {
  siteId: string;
  displayName: string;
  shortName: string;
  currentPhase: { id: string; label: string };
  missingCount: number;
  missingLabels: string[];
  bottlenecks: SiteBottleneck[];
  reportReady: boolean;
  flowStep: ExteriorSashFlowStep;
};

export function buildBoardSummary(): { sites: BoardSiteRow[] } {
  const sites = listExteriorSashSiteIds().map((id) => {
    const filled = filledPhotoSlotIdsForSite(id);
    const { missing } = missingRequiredSlots(id, filled);
    const cfg = getExteriorSashConfig(id)!;
    const bottlenecks = computeBottlenecks(id, filled);
    return {
      siteId: id,
      displayName: cfg.displayName,
      shortName: cfg.shortName,
      currentPhase: cfg.currentPhase,
      missingCount: missing.length,
      missingLabels: missing.map((m) => m.label),
      bottlenecks,
      reportReady: isReportReady(id, filled),
      flowStep: getExteriorSashFlow(id),
    };
  });
  return { sites };
}
