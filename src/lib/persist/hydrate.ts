import {
  listPersistedNotifications,
  listPersistedPhotos,
  listPersistedReports,
  mergeById,
} from "@/lib/persist/demo-events";
import {
  state,
  upsertNotification,
  upsertPhoto,
  upsertReport,
  type DemoNotification,
  type PhotoReport,
  type Report,
} from "@/lib/prototype-store";

/**
 * Redis 上の投稿をメモリにマージする。
 */
export async function hydrateDemoEvents(companyCode = "YMD35"): Promise<void> {
  try {
    const [reports, photos, notifications] = await Promise.all([
      listPersistedReports(companyCode),
      listPersistedPhotos(companyCode),
      listPersistedNotifications(companyCode),
    ]);
    for (const r of reports) upsertReport(r);
    for (const p of photos) upsertPhoto(p);
    for (const n of notifications) upsertNotification(n);
  } catch (error) {
    console.error("hydrateDemoEvents failed", error);
  }
}

export async function getMergedReports(companyCode: string, seed: Report[]): Promise<Report[]> {
  const overlay = await listPersistedReports(companyCode);
  return mergeById(seed, overlay);
}

export async function getMergedPhotos(
  companyCode: string,
  seed: PhotoReport[],
): Promise<PhotoReport[]> {
  const overlay = await listPersistedPhotos(companyCode);
  return mergeById(seed, overlay);
}

export async function getMergedNotifications(
  companyCode: string,
  seed: DemoNotification[],
): Promise<DemoNotification[]> {
  const overlay = await listPersistedNotifications(companyCode);
  return mergeById(seed, overlay);
}

export function currentMemoryReports(): Report[] {
  return state.reports;
}

export function currentMemoryPhotos(): PhotoReport[] {
  return state.photoReports;
}
