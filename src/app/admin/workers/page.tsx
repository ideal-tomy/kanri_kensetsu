import Link from "next/link";
import { HardHat } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { StatCard } from "@/components/viz/StatCard";
import { FutureFeatureBadge } from "@/components/common/FutureFeatureBadge";
import { ADMIN_COLORS } from "@/lib/admin-theme";
import { projects, workers } from "@/data/mock";

const STATUS_LABEL: Record<string, string> = {
  assigned: "担当中",
  available: "待機・調整可",
  off: "休み・不在",
};

const STATUS_COLOR: Record<string, string> = {
  assigned: ADMIN_COLORS.status.inProgress,
  available: ADMIN_COLORS.status.paused,
  off: ADMIN_COLORS.status.notStarted,
};

export default function WorkersPage() {
  const total = workers.length;
  const breakdown = workers.reduce<Record<string, number>>((acc, w) => {
    acc[w.status] = (acc[w.status] ?? 0) + 1;
    return acc;
  }, {});

  const utilization = workers
    .map((w) => ({
      name: w.name,
      experience: w.yearsExperience,
    }))
    .sort((a, b) => b.experience - a.experience);

  const donutData = Object.entries(breakdown).map(([status, count]) => ({
    name: STATUS_LABEL[status] ?? status,
    value: count,
    color: STATUS_COLOR[status],
  }));

  const assignedCount = breakdown.assigned ?? 0;
  const availableCount = breakdown.available ?? 0;
  const offCount = breakdown.off ?? 0;

  return (
    <PageShell
      mode="admin"
      title="作業員管理"
      subtitle="現場ごとの選定可否・経験年数・稼働状況"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "作業員管理" },
      ]}
    >
      <section className="grid gap-3 md:grid-cols-4">
        <StatCard
          label="総数"
          value={total}
          unit="名"
          icon={HardHat}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
        />
        <StatCard
          label="担当中"
          value={assignedCount}
          unit="名"
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
          highlight={assignedCount === 0 ? "warning" : "default"}
        />
        <StatCard
          label="待機・調整可"
          value={availableCount}
          unit="名"
          highlight={availableCount > 0 ? "warning" : "default"}
        />
        <StatCard
          label="休み・不在"
          value={offCount}
          unit="名"
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="ステータス内訳">
          <DonutChart
            data={donutData}
            centerLabel="名"
            centerValue={`${total}`}
          />
        </ChartCard>
        <ChartCard title="経験年数（参考）" subtitle="多い順" className="lg:col-span-2">
          <BarChartCard
            data={utilization}
            series={[{ key: "experience", label: "経験年数", color: ADMIN_COLORS.primary }]}
            xKey="name"
            layout="vertical"
            yUnit="年"
            showValues
            height={Math.max(220, utilization.length * 36)}
          />
        </ChartCard>
      </section>

      <section className="mt-6">
        <FutureFeatureBadge
          label="将来実装予定 — 資格・スキルタグ"
          description="現状はデモ用ラベル。Supabase 移行後に作業員プロフィール DB と連動します。"
        >
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {workers.map((worker) => {
              const project = projects.find((p) => p.id === worker.currentProjectId);
              return (
                <Link
                  key={worker.id}
                  href={`/admin/workers/${worker.id}`}
                  className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: STATUS_COLOR[worker.status] ?? ADMIN_COLORS.primary }}
                    >
                      <HardHat className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-base font-bold text-zinc-900">{worker.name}</p>
                      <p className="text-xs text-zinc-500">
                        {STATUS_LABEL[worker.status] ?? worker.status}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    担当現場
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-900">
                    {project?.projectName ?? "現場未割当"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-800">
                      経歴 {worker.yearsExperience}年
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      責任者: {worker.siteLeadExperience}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-medium text-zinc-500">保有資格</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {worker.qualificationTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-medium text-zinc-500">業務スキル</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {worker.skillTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </FutureFeatureBadge>
      </section>
    </PageShell>
  );
}
