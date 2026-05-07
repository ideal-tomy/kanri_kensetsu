"use client";

import type { PhotoReport } from "@/lib/prototype-store";
import { useRealtimePhotos } from "@/lib/hooks/useRealtimePhotos";
import { PhotoGalleryGrid } from "@/components/viz/PhotoGalleryGrid";

interface LivePhotoGalleryGridProps {
  initialPhotos: PhotoReport[];
  siteNameById?: Record<string, string>;
  showFilter?: boolean;
  columns?: 2 | 3 | 4;
  variant?: "grid" | "scroll";
  emptyText?: string;
  detailHrefBuilder?: (photo: PhotoReport) => string;
}

/**
 * Server Component から initialPhotos を受け取り、
 * Supabase が設定されていれば Realtime で自動再描画する。
 */
export function LivePhotoGalleryGrid({
  initialPhotos,
  ...rest
}: LivePhotoGalleryGridProps) {
  const photos = useRealtimePhotos(initialPhotos);
  return <PhotoGalleryGrid photos={photos} {...rest} />;
}
