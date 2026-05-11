"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COPY } from "@/lib/copy";

type NavRole = "legacy" | "worker" | "supervisor";

const ITEMS_BY_ROLE: Record<NavRole, { href: string; label: string }[]> = {
  legacy: [
    { href: "/", label: COPY.nav.home },
    { href: "/reports", label: COPY.nav.reports },
    { href: "/tasks", label: COPY.nav.tasks },
    { href: "/personnel", label: COPY.nav.personnel },
    { href: "/search", label: COPY.nav.search },
  ],
  worker: [
    { href: "/m/worker", label: "しごと" },
    { href: "/m/worker/work", label: "業務" },
    { href: "/m/worker/reporting", label: "報告" },
    { href: "/m/worker/chat", label: "トーク" },
    { href: "/m/worker/notice", label: "おしらせ" },
  ],
  supervisor: [
    { href: "/m/supervisor", label: "現場" },
    { href: "/m/supervisor/report", label: "日報" },
    { href: "/m/supervisor/tasks", label: "進捗" },
    { href: "/m/supervisor/personnel", label: "人員" },
    { href: "/m/supervisor/photo", label: "写真" },
    { href: "/m/supervisor/chat", label: "トーク" },
  ],
};

export function BottomNav({ role = "legacy" }: { role?: NavRole }) {
  const pathname = usePathname();
  const items = ITEMS_BY_ROLE[role];
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-white p-2">
      <ul
        className="mx-auto grid max-w-3xl gap-2"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        }}
      >
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex min-h-11 items-center justify-center rounded-lg px-2 text-sm font-bold ${
                  active ? "bg-orange-600 text-white" : "bg-zinc-200 text-zinc-900"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
