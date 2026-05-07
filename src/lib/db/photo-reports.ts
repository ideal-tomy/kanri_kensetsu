import {
  getPhotoReportsForUser as getPhotoReportsFromStore,
  state,
  type PhotoCategory,
  type PhotoReport,
} from "@/lib/prototype-store";
import type { SessionUser } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface PhotoReportRow {
  id: string;
  site_id: string;
  user_id: string | null;
  user_name: string;
  category: PhotoCategory;
  file_name: string;
  title: string | null;
  note: string | null;
  storage_path: string;
  created_at: string;
}

function toPhotoReport(row: PhotoReportRow): PhotoReport {
  return {
    id: row.id,
    siteId: row.site_id,
    userName: row.user_name,
    category: row.category,
    fileName: row.file_name,
    title: row.title ?? undefined,
    note: row.note ?? undefined,
    storagePath: row.storage_path,
    createdAt: row.created_at,
  };
}

/**
 * Phase 2 で prototype-store から差し替えるエントリポイント。
 * Supabase 未設定時は prototype-store にそのままフォールバックするので、
 * ページ側は import を変えるだけで段階的に移行できる。
 */
export async function getPhotoReportsForUser(
  user: SessionUser,
  category?: PhotoCategory,
): Promise<PhotoReport[]> {
  if (!isSupabaseConfigured) {
    return getPhotoReportsFromStore(user, category);
  }

  const supabase = await createServerClient();
  if (!supabase) {
    return getPhotoReportsFromStore(user, category);
  }

  let query = supabase
    .from("photo_reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error("supabase getPhotoReportsForUser error", error);
    return getPhotoReportsFromStore(user, category);
  }
  return (data as PhotoReportRow[]).map(toPhotoReport);
}

/**
 * shadow write の補助: prototype-store に書いた直後に Supabase に同じ行を入れる。
 * 失敗してもアプリは継続する（呼び出し側で握りつぶし）。
 */
export async function shadowInsertPhotoReport(photo: PhotoReport): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { createServiceRoleClient } = await import("@/lib/supabase/server");
  const supabase = createServiceRoleClient();
  if (!supabase) return;

  // 注意: site_id / user_id が UUID でない場合（prototype-store の "site-1" 等）は
  // migration_id_map を引いて変換する必要がある（Phase 2 の T2-02）。
  // ここでは UUID 形式かをチェックして、UUID でないものはスキップしておく。
  const looksLikeUuid = /^[0-9a-f-]{36}$/i;
  if (!looksLikeUuid.test(photo.siteId)) {
    return;
  }

  await supabase.from("photo_reports").insert({
    id: photo.id,
    site_id: photo.siteId,
    user_id: null,
    user_name: photo.userName,
    category: photo.category,
    file_name: photo.fileName,
    title: photo.title ?? null,
    note: photo.note ?? null,
    storage_path: photo.storagePath,
    created_at: photo.createdAt,
  });
}

/**
 * Realtime 購読のチャンネル名（クライアント側で利用）。
 */
export const PHOTO_REPORTS_CHANNEL = "photo_reports_realtime";

// テストやヘルパー目的で prototype-store の参照も export
export { state };
