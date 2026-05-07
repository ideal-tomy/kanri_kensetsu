import type { ReactNode } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/projects", label: "現場" },
  { href: "/admin/workers", label: "人員" },
  { href: "/admin/field-reports", label: "日報" },
  { href: "/admin/reports/photos", label: "写真" },
  { href: "/admin/knowledge", label: "検索" },
  { href: "/admin/settings", label: "設定" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100 md:flex">
      <aside className="border-b border-zinc-200 bg-white p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <h1 className="text-lg font-bold">管理モード</h1>
        <nav className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-1">
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
