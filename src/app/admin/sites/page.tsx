import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { ProgressRing } from "@/components/viz/ProgressRing";
import { StatCard } from "@/components/viz/StatCard";
import { state } from "@/lib/prototype-store";
import {
  getSiteProgressList,
  getTodayLiveStats,
} from "@/lib/admin-stats";
import { ADMIN_COLORS } from "@/lib/admin-theme";

export default function AdminSitesPage() {
  const sites = state.sites;
  const stats = getTodayLiveStats();
  const progressList = getSiteProgressList(sites);
  const barData = progressList.map((row) => ({
    name: row.site.name,
    progress: row.progressPercent,
  }));

  return (
    <PageShell
      mode="admin"
      title="現場管理"
      subtitle="進行中の現場を一覧・進捗・直近活動で把握"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "現場管理" },
      ]}
    >
      <section className="grid gap-3 md:grid-cols-3">
        <StatCard
          label="稼働中の現場"
          value={stats.activeSites}
          unit="現場"
          icon={Building2}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="進行中タスク"
          value={stats.inProgressTasks}
          unit="件"
        />
        <StatCard
          label="今日の写真"
          value={stats.todayPhotos}
          unit="枚"
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
        />
      </section>

      <section className="mt-6">
        <ChartCard
          title="現場別 進捗率"
          subtitle="全体の進捗を比較"
        >
          <BarChartCard
            data={barData}
            series={[{ key: "progress", label: "進捗率", color: ADMIN_COLORS.primary }]}
            xKey="name"
            layout="vertical"
            yUnit="%"
            showValues
            height={Math.max(180, barData.length * 44)}
          />
        </ChartCard>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {progressList.map((row) => (
          <article
            key={row.site.id}
            className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <Link
              href={`/admin/projects/${row.site.id}`}
              className="block p-4 transition hover:bg-zinc-50/80"
            >
              <div className="flex items-start gap-4">
                <ProgressRing value={row.progressPercent} size={88} thickness={9} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-zinc-500">{row.site.companyCode}</p>
                  <h3 className="text-base font-bold text-zinc-900">{row.site.name}</h3>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-500">
                    <MapPin className="h-3 w-3" />
                    {row.site.startedAt} 〜 {row.site.endedAt ?? "未定"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800">
                      タスク {row.completedTasks}/{row.totalTasks}
                    </span>
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-800">
                      写真 {row.photoCount}枚
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.site.status === "active"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {row.site.status === "active" ? "進行中" : "完了"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs font-medium text-primary group-hover:underline">
                案件サマリーへ →
              </p>
            </Link>
            <div className="flex gap-4 border-t border-zinc-100 px-4 py-2 text-xs font-semibold">
              <Link
                href={`/admin/sites/${encodeURIComponent(row.site.id)}/phases`}
                className="text-zinc-700 underline hover:text-primary"
              >
                工程管理
              </Link>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
