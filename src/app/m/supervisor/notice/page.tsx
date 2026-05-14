import { BellRing } from "lucide-react";
import { BottomNav } from "@/components/nav/bottom-nav";
import { TimelineList, type TimelineItem } from "@/components/viz/TimelineList";
import { StatCard } from "@/components/viz/StatCard";
import { requireSupervisorSession } from "@/lib/auth/admin";
import { state } from "@/lib/prototype-store";

export default async function SupervisorNoticePage() {
  await requireSupervisorSession();
  const notifications = state.notifications;
  const assignmentChanges = state.assignmentChanges;

  const items: TimelineItem[] = [
    ...notifications.map<TimelineItem>((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      meta: n.userName,
      timestamp: n.createdAt,
      type: "notification",
      severity:
        n.title.includes("中断") || n.title.includes("雨")
          ? "warning"
          : n.title.includes("緊急")
            ? "danger"
            : "info",
    })),
    ...assignmentChanges.map<TimelineItem>((c) => ({
      id: c.id,
      title: "配員の急変更",
      body: `${c.beforeSiteName} → ${c.afterSiteName}（理由：${c.reason}）`,
      timestamp: c.changedAt,
      type: "alert",
      severity: "warning",
    })),
  ].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  const todayCount = items.filter((i) => {
    const today = new Date().toISOString().slice(0, 10);
    return i.timestamp.slice(0, 10) === today;
  }).length;

  return (
    <main className="space-y-4 p-4 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900">おしらせ</h1>
        <p className="mt-1 text-sm font-medium text-zinc-700">
          配置変更や現場連絡を集約します。
        </p>
      </header>

      <section className="grid gap-3 grid-cols-2">
        <StatCard
          label="今日のおしらせ"
          value={todayCount}
          unit="件"
          icon={BellRing}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
          highlight={todayCount > 0 ? "warning" : "default"}
        />
        <StatCard
          label="累計"
          value={items.length}
          unit="件"
        />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <TimelineList items={items} emptyText="まだおしらせはありません" />
      </section>

      <BottomNav role="supervisor" />
    </main>
  );
}
