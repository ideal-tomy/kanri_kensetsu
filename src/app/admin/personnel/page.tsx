import Link from "next/link";
import { ArrowRight, Calendar, Users } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { StatCard } from "@/components/viz/StatCard";
import { WeekCalendar } from "@/components/personnel/week-calendar";
import { state } from "@/lib/prototype-store";

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function AdminPersonnelPage() {
  const liveSites = state.sites.map((s) => ({ id: s.id, name: s.name }));
  const liveAssignments = state.assignments;
  const today = todayStr();
  const todayCount = liveAssignments.filter((a) => a.workDate === today).length;

  return (
    <PageShell
      mode="admin"
      title="人員配置"
      subtitle="週カレンダー（ライブ）で人員を俯瞰"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "人員配置" },
      ]}
    >
      <section className="grid gap-3 md:grid-cols-3">
        <StatCard
          label="今日の配員"
          value={todayCount}
          unit="件"
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="今週の予定"
          value={liveAssignments.length}
          unit="件"
          icon={Calendar}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
        />
        <StatCard
          label="現場数"
          value={liveSites.length}
          unit="現場"
        />
      </section>

      <section className="mt-6">
        <ChartCard
          title="今週の人員カレンダー"
          subtitle="現場 × 曜日（ライブ）"
          action={
            <Link
              href="/admin/assignments"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary underline"
            >
              配員画面で詳細を見る
              <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <WeekCalendar
            sites={liveSites}
            assignments={liveAssignments}
            todayStr={today}
          />
        </ChartCard>
      </section>
    </PageShell>
  );
}
