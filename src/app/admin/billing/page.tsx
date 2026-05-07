import { TrendingUp, Wallet } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { BarList } from "@/components/charts/BarList";
import { StatCard } from "@/components/viz/StatCard";
import { ADMIN_COLORS } from "@/lib/admin-theme";
import { revenueForecasts } from "@/data/mock";
import { projects } from "@/data/mock/projects";
import { formatCurrency } from "@/lib/format";

export default function BillingPage() {
  // 月別合計
  const monthlyMap = new Map<string, { forecast: number; actual: number }>();
  for (const item of revenueForecasts) {
    const cur = monthlyMap.get(item.month) ?? { forecast: 0, actual: 0 };
    cur.forecast += item.forecastAmount;
    cur.actual += item.actualAmount ?? 0;
    monthlyMap.set(item.month, cur);
  }
  const monthlyData = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, sums]) => ({
      label: month,
      forecast: Math.round(sums.forecast / 10000),
      actual: Math.round(sums.actual / 10000),
    }));

  // 案件別合計
  const perProject = projects
    .map((p) => {
      const total = revenueForecasts
        .filter((r) => r.projectId === p.id)
        .reduce((sum, r) => sum + r.forecastAmount, 0);
      return { name: p.projectName, value: Math.round(total / 10000) };
    })
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalForecast = revenueForecasts.reduce((s, i) => s + i.forecastAmount, 0);
  const totalActual = revenueForecasts.reduce((s, i) => s + (i.actualAmount ?? 0), 0);
  const achievement =
    totalForecast > 0 ? Math.round((totalActual / totalForecast) * 100) : 0;

  return (
    <PageShell
      mode="admin"
      title="請求見込み"
      subtitle="月次売上見込みと達成率"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "請求見込み" },
      ]}
    >
      <section className="grid gap-3 md:grid-cols-3">
        <StatCard
          label="累計 見込み"
          value={formatCurrency(totalForecast)}
          icon={TrendingUp}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
        />
        <StatCard
          label="累計 実績"
          value={formatCurrency(totalActual)}
          icon={Wallet}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="達成率"
          value={achievement}
          unit="%"
          highlight={achievement < 80 ? "warning" : "success"}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="月次推移（万円）"
          subtitle="見込みと実績"
          className="lg:col-span-2"
        >
          <LineChartCard
            data={monthlyData}
            series={[
              { key: "forecast", label: "見込み", color: ADMIN_COLORS.primary },
              { key: "actual", label: "実績", color: ADMIN_COLORS.status.completed },
            ]}
            xKey="label"
            yUnit="万"
            height={260}
          />
        </ChartCard>
        <ChartCard title="案件別 累計（万円）" subtitle="見込みベース">
          <BarList data={perProject} unit="万円" />
        </ChartCard>
      </section>

      <section className="mt-6">
        <ChartCard title="案件別 月次見込み" subtitle="（万円）">
          <BarChartCard
            data={perProject}
            series={[{ key: "value", label: "見込み", color: ADMIN_COLORS.primary }]}
            xKey="name"
            layout="vertical"
            yUnit="万"
            showValues
            height={Math.max(220, perProject.length * 36)}
          />
        </ChartCard>
      </section>

      <section className="mt-6">
        <ChartCard title="個別レコード" subtitle="現状の見込み一覧">
          <ul className="space-y-2">
            {revenueForecasts.map((item) => {
              const project = projects.find((p) => p.id === item.projectId);
              return (
                <li
                  key={item.id}
                  className="rounded-lg border border-zinc-200 bg-white p-3"
                >
                  <p className="font-bold text-zinc-900">{project?.projectName}</p>
                  <p className="text-xs text-zinc-500">{item.month}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm">
                    <span className="text-zinc-700">
                      見込み <span className="font-bold">{formatCurrency(item.forecastAmount)}</span>
                    </span>
                    {item.actualAmount != null ? (
                      <span className="text-zinc-700">
                        実績 <span className="font-bold">{formatCurrency(item.actualAmount)}</span>
                      </span>
                    ) : null}
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs">
                      信頼度 {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </ChartCard>
      </section>
    </PageShell>
  );
}
