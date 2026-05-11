"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  AlertCircle,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FolderCog,
  Gauge,
  Handshake,
  HardHat,
  Home,
  Layers,
  type LucideIcon,
  MapPin,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  id: string;
  label: string;
  links: NavLink[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "home",
    label: "ホーム",
    links: [
      { href: "/admin", label: "ダッシュボード", icon: Gauge },
    ],
  },
  {
    id: "site",
    label: "現場",
    links: [
      { href: "/admin/sites", label: "現場管理", icon: MapPin },
      { href: "/admin/projects", label: "現場案件", icon: Briefcase },
    ],
  },
  {
    id: "report",
    label: "報告",
    links: [
      { href: "/admin/field-reports", label: "現場報告確認", icon: ClipboardCheck },
      { href: "/admin/reports/photos", label: "施工写真", icon: Camera },
      { href: "/admin/reports/output", label: "報告書出力", icon: FileText },
      { href: "/admin/demo/exterior-sash", label: "外壁サッシ詰まりデモ", icon: AlertCircle },
      { href: "/admin/safety-docs", label: "安全書類", icon: ShieldCheck },
    ],
  },
  {
    id: "master",
    label: "マスタ",
    links: [
      { href: "/admin/master/clients", label: "取引先", icon: Building2 },
      { href: "/admin/master/end-customers", label: "施主", icon: Home },
      { href: "/admin/master/report-templates", label: "報告書テンプレ", icon: FolderCog },
    ],
  },
  {
    id: "people",
    label: "人",
    links: [
      { href: "/admin/workers", label: "作業員", icon: HardHat },
      { href: "/admin/assignments", label: "配員", icon: Calendar },
      { href: "/admin/dispatch", label: "現場手配", icon: Handshake },
    ],
  },
  {
    id: "numbers",
    label: "数字",
    links: [
      { href: "/admin/billing", label: "請求見込み", icon: BarChart3 },
      { href: "/admin/alerts", label: "アラート", icon: AlertTriangle },
    ],
  },
  {
    id: "comm",
    label: "コミュニケーション",
    links: [
      { href: "/admin/chat", label: "チャット", icon: MessageSquare },
    ],
  },
  {
    id: "other",
    label: "その他",
    links: [
      { href: "/admin/documents", label: "書類作成", icon: FileText },
      { href: "/admin/knowledge", label: "ナレッジ", icon: BookOpen },
      { href: "/admin/search", label: "検索", icon: Search },
      { href: "/admin/members", label: "メンバー", icon: Users },
      { href: "/admin/settings", label: "設定", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const toggle = (id: string) =>
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className="border-b border-zinc-200 bg-white md:min-h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between p-4 md:block md:p-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Layers className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-xs text-zinc-500">管理モード</p>
            <p className="text-sm font-bold text-zinc-900">現場ポケット</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-700"
          aria-label="メニュー"
        >
          {mobileOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
      <nav
        className={`px-2 pb-3 md:block ${mobileOpen ? "block" : "hidden"}`}
        aria-label="管理ナビゲーション"
      >
        <ul className="space-y-3">
          {NAV_GROUPS.map((group) => {
            const open = !collapsed[group.id];
            return (
              <li key={group.id}>
                <button
                  type="button"
                  onClick={() => toggle(group.id)}
                  className="flex w-full items-center justify-between px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-zinc-400 hover:text-zinc-700"
                >
                  <span>{group.label}</span>
                  {open ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
                {open ? (
                  <ul className="mt-1 space-y-0.5">
                    {group.links.map((link) => {
                      const active = isActive(link.href);
                      const Icon = link.icon;
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className={`flex min-h-9 items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition ${
                              active
                                ? "bg-primary text-primary-foreground"
                                : "text-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" aria-hidden />
                            <span className="truncate">{link.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <p className="flex items-center gap-1.5 font-bold">
            <Bell className="h-3.5 w-3.5" />
            デモ環境
          </p>
          <p className="mt-1 text-amber-800">
            データはセッション内のみで保持されます
          </p>
        </div>
      </nav>
    </aside>
  );
}
