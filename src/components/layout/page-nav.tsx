"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageNavProps {
  mode: "admin" | "report";
  listHref?: string;
  listLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageNav({ mode, listHref, listLabel, breadcrumbs }: PageNavProps) {
  const router = useRouter();
  const topHref = mode === "admin" ? "/admin" : "/report";

  return (
    <div className="mb-4 space-y-3">
      {mode === "admin" && breadcrumbs?.length ? (
        <nav className="text-xs text-zinc-500">
          {breadcrumbs.map((item, idx) => (
            <span key={`${item.label}-${idx}`}>
              {item.href ? (
                <Link href={item.href} className="hover:text-zinc-700">
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-zinc-700">{item.label}</span>
              )}
              {idx < breadcrumbs.length - 1 ? " / " : ""}
            </span>
          ))}
        </nav>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </button>
        <Link
          href={topHref}
          className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700"
        >
          <Home className="h-4 w-4" />
          トップ
        </Link>
        {listHref && listLabel ? (
          <Link
            href={listHref}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700"
          >
            {listLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
