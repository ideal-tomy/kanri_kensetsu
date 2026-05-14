import Link from "next/link";
import {
  BookOpen,
  Bug,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  MapPin,
  Wrench,
} from "lucide-react";
import { BottomNav } from "@/components/nav/bottom-nav";
import { getSessionFromCookies } from "@/lib/auth/session";
import { getAssignmentsForUser, getSitesForUser, getTasksForUser } from "@/lib/prototype-store";

const actionGroups: {
  title: string;
  hint: string;
  items: { href: string; label: string; icon: typeof BookOpen }[];
}[] = [
  {
    title: "今日のしごと",
    hint: "報告・打刻",
    items: [
      { href: "/m/worker/reporting", label: "報告・連絡", icon: ClipboardList },
      { href: "/m/worker/attendance", label: "打刻", icon: CalendarClock },
    ],
  },
  {
    title: "情報の共有",
    hint: "図面・不具合など",
    items: [
      { href: "/m/worker/blueprints", label: "図面確認", icon: BookOpen },
      { href: "/m/worker/defects", label: "不具合・傷報告", icon: Bug },
    ],
  },
];

export default async function WorkerHomePage() {
  const user = await getSessionFromCookies();
  if (!user) return null;

  const assignments = getAssignmentsForUser(user);
  const today = new Date().toISOString().slice(0, 10);
  const todayAssignment = assignments.find((item) => item.workDate === today);
  const site = getSitesForUser(user).find((item) => item.id === todayAssignment?.siteId);
  const tasks = getTasksForUser(user).filter((item) => item.siteId === todayAssignment?.siteId);

  return (
    <main className="space-y-6 p-4 pb-24">
      <Link
        href="/m/worker/work/site"
        className="block rounded-2xl border-2 border-zinc-300 bg-white p-5 shadow-sm transition active:scale-[0.99]"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500">
            <MapPin className="h-4 w-4 text-primary" aria-hidden />
            今日の現場
          </span>
          <ChevronRight className="h-5 w-5 text-zinc-400" aria-hidden />
        </div>
        {site ? (
          <>
            <p className="mt-2 text-2xl font-bold text-zinc-900">{site.name}</p>
            <p className="mt-2 inline-flex rounded-full bg-primary-muted px-3 py-1 text-base font-bold text-primary">
              集合 {todayAssignment?.shift === "night_full" ? "20:00" : "8:00"}
            </p>
          </>
        ) : (
          <p className="mt-2 text-lg font-semibold text-zinc-800">今日は配置がありません</p>
        )}
      </Link>

      <Link
        href="/m/worker/work/tasks"
        className="block rounded-2xl border-2 border-zinc-300 bg-white p-5 shadow-sm transition active:scale-[0.99]"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500">
            <Wrench className="h-4 w-4 text-primary" aria-hidden />
            業務内容
          </span>
          <ChevronRight className="h-5 w-5 text-zinc-400" aria-hidden />
        </div>
        {tasks.length > 0 ? (
          <>
            <p className="mt-2 text-2xl font-bold text-zinc-900">{tasks.length}件の業務</p>
            <p className="mt-1 text-base font-semibold text-zinc-700">
              タップして内容を確認
            </p>
          </>
        ) : (
          <p className="mt-2 text-lg font-semibold text-zinc-800">本日の業務内容は未登録です</p>
        )}
      </Link>

      {actionGroups.map((group) => (
        <section key={group.title} className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-500">{group.title}</h2>
            <p className="text-xs text-zinc-500">{group.hint}</p>
          </div>
          <div className="space-y-3">
            {group.items.map((button) => (
              <Link
                key={button.href}
                href={button.href}
                className="flex h-[4.5rem] items-center justify-center gap-3 rounded-3xl bg-primary px-4 text-center text-xl font-bold text-primary-foreground shadow-md transition hover:opacity-95 active:scale-[0.99]"
              >
                <button.icon className="h-7 w-7 shrink-0" aria-hidden />
                <span>{button.label}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <BottomNav role="worker" />
    </main>
  );
}
