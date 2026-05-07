"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { PhotoCategory, PhotoReport } from "@/lib/prototype-store";
import { CATEGORY_BG, CATEGORY_LABEL } from "@/lib/admin-theme";

interface PhotoGalleryGridProps {
  photos: PhotoReport[];
  siteNameById?: Record<string, string>;
  showFilter?: boolean;
  columns?: 2 | 3 | 4;
  variant?: "grid" | "scroll";
  emptyText?: string;
  /** 詳細ページの href テンプレート。`{id}` を写真 ID に置換 */
  detailHrefTemplate?: string;
  /** 詳細ページの href マップ（写真 ID -> URL）。template より優先 */
  detailHrefMap?: Record<string, string>;
}

const COLS_CLASS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

function buildHref(
  photo: PhotoReport,
  template?: string,
  map?: Record<string, string>,
): string | undefined {
  if (map?.[photo.id]) return map[photo.id];
  if (template) return template.replace("{id}", photo.id);
  return undefined;
}

export function PhotoGalleryGrid({
  photos,
  siteNameById,
  showFilter = true,
  columns = 4,
  variant = "grid",
  emptyText = "まだ写真がありません",
  detailHrefTemplate,
  detailHrefMap,
}: PhotoGalleryGridProps) {
  const [filter, setFilter] = useState<PhotoCategory | "all">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return photos;
    return photos.filter((p) => p.category === filter);
  }, [photos, filter]);

  const counts = useMemo(() => {
    return {
      all: photos.length,
      regular: photos.filter((p) => p.category === "regular").length,
      progress: photos.filter((p) => p.category === "progress").length,
    };
  }, [photos]);

  if (!photos.length) {
    return (
      <div className="rounded-xl bg-zinc-50 py-10 text-center text-sm text-zinc-500">
        {emptyText}
      </div>
    );
  }

  const filters: Array<{ id: typeof filter; label: string; count: number }> = [
    { id: "all", label: "全件", count: counts.all },
    { id: "regular", label: CATEGORY_LABEL.regular, count: counts.regular },
    { id: "progress", label: CATEGORY_LABEL.progress, count: counts.progress },
  ];

  return (
    <div className="space-y-3">
      {showFilter ? (
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`min-h-9 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === f.id
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {f.label}
              <span className="ml-1 text-xs opacity-80">({f.count})</span>
            </button>
          ))}
        </div>
      ) : null}

      {variant === "scroll" ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {filtered.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              siteName={siteNameById?.[photo.siteId]}
              variant="scroll"
              detailHref={buildHref(photo, detailHrefTemplate, detailHrefMap)}
            />
          ))}
        </div>
      ) : (
        <div className={`grid gap-3 ${COLS_CLASS[columns]}`}>
          {filtered.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              siteName={siteNameById?.[photo.siteId]}
              detailHref={buildHref(photo, detailHrefTemplate, detailHrefMap)}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-500">
          該当する写真はありません
        </p>
      ) : null}
    </div>
  );
}

function PhotoCard({
  photo,
  siteName,
  variant = "grid",
  detailHref,
}: {
  photo: PhotoReport;
  siteName?: string;
  variant?: "grid" | "scroll";
  detailHref?: string;
}) {
  const wrapperClass =
    variant === "scroll"
      ? "min-w-[180px] overflow-hidden rounded-lg border border-zinc-200 bg-white"
      : "overflow-hidden rounded-lg border border-zinc-200 bg-white";

  const inner = (
    <article className={wrapperClass}>
      <div className="relative aspect-video bg-zinc-100">
        <span
          className={`absolute top-2 left-2 z-10 rounded px-2 py-0.5 text-[10px] font-bold ${CATEGORY_BG[photo.category]}`}
        >
          {CATEGORY_LABEL[photo.category]}
        </span>
        <div className="flex h-full w-full items-center justify-center text-zinc-400">
          <ImageIcon className="h-8 w-8" aria-hidden />
        </div>
      </div>
      <div className="p-3">
        {photo.title ? (
          <h3 className="line-clamp-2 text-sm font-bold text-zinc-900">
            {photo.title}
          </h3>
        ) : (
          <h3 className="line-clamp-2 text-sm font-medium text-zinc-700">
            {photo.fileName}
          </h3>
        )}
        <p className="mt-1 text-xs text-zinc-500">
          {photo.userName}
          {siteName ? ` / ${siteName}` : ""}
        </p>
        <p className="text-xs text-zinc-400">{formatDate(photo.createdAt)}</p>
        {photo.note ? (
          <p className="mt-2 line-clamp-2 text-xs text-zinc-700">{photo.note}</p>
        ) : null}
      </div>
    </article>
  );

  if (detailHref) {
    return (
      <Link href={detailHref} className="block transition hover:-translate-y-0.5">
        {inner}
      </Link>
    );
  }
  return inner;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
