"use client";

import { useEffect, useMemo, useState } from "react";
import type { PhotoReport } from "@/lib/prototype-store";
import { createClient } from "@/lib/supabase/browser";

interface PhotoReportRow {
  id: string;
  site_id: string;
  user_name: string;
  category: PhotoReport["category"];
  file_name: string;
  title: string | null;
  note: string | null;
  storage_path: string;
  created_at: string;
}

const toPhotoReport = (row: PhotoReportRow): PhotoReport => ({
  id: row.id,
  siteId: row.site_id,
  userName: row.user_name,
  category: row.category,
  fileName: row.file_name,
  title: row.title ?? undefined,
  note: row.note ?? undefined,
  storagePath: row.storage_path,
  createdAt: row.created_at,
});

/**
 * 写真投稿の Realtime 購読フック。
 * Supabase 未設定環境では何もせず初期 photos をそのまま返す。
 *
 * 実装ノート: initialPhotos の同期は state にコピーせず、
 * extra（Realtime で受け取った追加分）だけを state に持って
 * render 時にマージする。これにより親側の再レンダーで
 * cascading render が発生しない。
 */
export function useRealtimePhotos(initialPhotos: PhotoReport[]) {
  const [extra, setExtra] = useState<PhotoReport[]>([]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel("photo_reports_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "photo_reports" },
        (payload) => {
          const row = payload.new as PhotoReportRow;
          setExtra((prev) => [toPhotoReport(row), ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return useMemo(() => {
    if (extra.length === 0) return initialPhotos;
    const seen = new Set<string>();
    const merged: PhotoReport[] = [];
    for (const photo of [...extra, ...initialPhotos]) {
      if (seen.has(photo.id)) continue;
      seen.add(photo.id);
      merged.push(photo);
    }
    return merged;
  }, [extra, initialPhotos]);
}
