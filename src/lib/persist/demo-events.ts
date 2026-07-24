import type { PhotoReport, Report } from "@/lib/prototype-store";
import type { DemoNotification } from "@/lib/prototype-store";
import { getRedis, isRedisConfigured, persistKey } from "@/lib/persist/redis";

const DEFAULT_COMPANY = "YMD35";
const MAX_ITEMS = 200;

async function lpushJson<T>(key: string, item: T): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.lpush(key, JSON.stringify(item));
  await redis.ltrim(key, 0, MAX_ITEMS - 1);
}

async function lrangeJson<T>(key: string): Promise<T[]> {
  const redis = getRedis();
  if (!redis) return [];
  const rows = await redis.lrange<string>(key, 0, MAX_ITEMS - 1);
  const out: T[] = [];
  for (const row of rows) {
    try {
      const parsed = typeof row === "string" ? (JSON.parse(row) as T) : (row as T);
      out.push(parsed);
    } catch {
      // skip corrupt entries
    }
  }
  return out;
}

export async function appendPersistedReport(
  companyCode: string,
  report: Report,
): Promise<void> {
  if (!isRedisConfigured()) return;
  await lpushJson(persistKey(companyCode || DEFAULT_COMPANY, "reports"), report);
}

export async function appendPersistedPhoto(
  companyCode: string,
  photo: PhotoReport,
): Promise<void> {
  if (!isRedisConfigured()) return;
  await lpushJson(persistKey(companyCode || DEFAULT_COMPANY, "photos"), photo);
}

export async function appendPersistedNotification(
  companyCode: string,
  notification: DemoNotification,
): Promise<void> {
  if (!isRedisConfigured()) return;
  await lpushJson(
    persistKey(companyCode || DEFAULT_COMPANY, "notifications"),
    notification,
  );
}

export async function listPersistedReports(companyCode: string): Promise<Report[]> {
  return lrangeJson<Report>(persistKey(companyCode || DEFAULT_COMPANY, "reports"));
}

export async function listPersistedPhotos(companyCode: string): Promise<PhotoReport[]> {
  return lrangeJson<PhotoReport>(persistKey(companyCode || DEFAULT_COMPANY, "photos"));
}

export async function listPersistedNotifications(
  companyCode: string,
): Promise<DemoNotification[]> {
  return lrangeJson<DemoNotification>(
    persistKey(companyCode || DEFAULT_COMPANY, "notifications"),
  );
}

export function mergeById<T extends { id: string; createdAt?: string }>(
  seed: T[],
  overlay: T[],
): T[] {
  const map = new Map<string, T>();
  for (const item of seed) map.set(item.id, item);
  for (const item of overlay) map.set(item.id, item);
  return Array.from(map.values()).sort((a, b) => {
    const at = a.createdAt ?? "";
    const bt = b.createdAt ?? "";
    return at < bt ? 1 : -1;
  });
}
