import type { ReactNode } from "react";
import Link from "next/link";
import { ModeHeader } from "@/components/layout/mode-header";
import { PageNav } from "@/components/layout/page-nav";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageShellProps {
  mode: "admin" | "report";
  title: string;
  subtitle?: string;
  listHref?: string;
  listLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
}

export function PageShell({
  mode,
  title,
  subtitle,
  listHref,
  listLabel,
  breadcrumbs,
  children,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-zinc-100">
      <ModeHeader current={mode} title={title} subtitle={subtitle} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-24">
        <PageNav
          mode={mode}
          listHref={listHref}
          listLabel={listLabel}
          breadcrumbs={breadcrumbs}
        />
        {children}
      </main>
      {mode === "report" ? (
        <div className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2">
          <Link
            href="/report"
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg"
          >
            現場メニューへ
          </Link>
        </div>
      ) : null}
    </div>
  );
}
