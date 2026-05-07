import Link from "next/link";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { ProgressRing } from "@/components/viz/ProgressRing";
import { StatCard } from "@/components/viz/StatCard";
import { ADMIN_COLORS } from "@/lib/admin-theme";
import { projects } from "@/data/mock";

const STATUS_LABEL: Record<string, string> = {
  active: "進行中",
  follow_required: "要フォロー",
  planning: "計画中",
  completed: "完了",
};

const STATUS_COLOR: Record<string, string> = {
  active: ADMIN_COLORS.status.inProgress,
  follow_required: ADMIN_COLORS.status.paused,
  planning: ADMIN_COLORS.status.notStarted,
  completed: ADMIN_COLORS.status.completed,
};

export default function ProjectsPage() {
  const total = projects.length;
  const breakdown = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const donutData = Object.entries(breakdown).map(([status, count]) => ({
    name: STATUS_LABEL[status] ?? status,
    value: count,
    color: STATUS_COLOR[status],
  }));

  const progressBarData = [...projects]
    .sort((a, b) => (b.progressPercent ?? 0) - (a.progressPercent ?? 0))
    .map((p) => ({ name: p.projectName, progress: p.progressPercent ?? 0 }));

  const sumProgress = projects.reduce((s, p) => s + (p.progressPercent ?? 0), 0);
  const avgProgress = total ? Math.round(sumProgress / total) : 0;

  return (
    <PageShell
      mode="admin"
      title="現場案件一覧"
      subtitle="全案件の進捗・ステータスを俯瞰"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "現場案件一覧" },
      ]}
    >
      <section className="grid gap-3 md:grid-cols-3">
        <StatCard
          label="案件数"
          value={total}
          unit="件"
          icon={Briefcase}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="平均進捗"
          value={avgProgress}
          unit="%"
        />
        <StatCard
          label="要フォロー"
          value={breakdown.follow_required ?? 0}
          unit="件"
          highlight={(breakdown.follow_required ?? 0) > 0 ? "warning" : "default"}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="ステータス内訳" className="lg:col-span-1">
          <DonutChart
            data={donutData}
            centerLabel="案件"
            centerValue={`${total}`}
          />
        </ChartCard>
        <ChartCard
          title="案件別 進捗率"
          subtitle="進捗率（％）の比較"
          className="lg:col-span-2"
        >
          <BarChartCard
            data={progressBarData}
            series={[{ key: "progress", label: "進捗", color: ADMIN_COLORS.primary }]}
            xKey="name"
            layout="vertical"
            yUnit="%"
            showValues
            height={Math.max(220, progressBarData.length * 38)}
          />
        </ChartCard>
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/admin/projects/${project.id}`}
            className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <ProgressRing
                value={project.progressPercent ?? 0}
                size={80}
                thickness={8}
                color={STATUS_COLOR[project.status] ?? ADMIN_COLORS.primary}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-zinc-500">{project.projectCode}</p>
                <h3 className="text-base font-bold text-zinc-900">{project.projectName}</h3>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-500">
                  <MapPin className="h-3 w-3" />
                  {project.siteAddress}
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-500">
                  <Calendar className="h-3 w-3" />
                  {project.startDate} 〜 {project.endDate}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: STATUS_COLOR[project.status] ?? ADMIN_COLORS.primary }}
                  >
                    {STATUS_LABEL[project.status] ?? project.status}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                    {project.clientName}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
