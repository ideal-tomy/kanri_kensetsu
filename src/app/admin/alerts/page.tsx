import { AlertTriangle, BellRing, Sparkles } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { StatCard } from "@/components/viz/StatCard";
import { FutureFeatureBadge } from "@/components/common/FutureFeatureBadge";
import { ADMIN_COLORS } from "@/lib/admin-theme";
import { alertNotifications, projects } from "@/data/mock";

const LEVEL_LABEL: Record<string, string> = {
  critical: "重大",
  warning: "警告",
  info: "情報",
};

const LEVEL_COLOR: Record<string, string> = {
  critical: ADMIN_COLORS.severity.danger,
  warning: ADMIN_COLORS.severity.warning,
  info: ADMIN_COLORS.severity.info,
};

export default function AlertsPage() {
  const total = alertNotifications.length;
  const breakdown = alertNotifications.reduce<Record<string, number>>((acc, a) => {
    acc[a.level] = (acc[a.level] ?? 0) + 1;
    return acc;
  }, {});
  const unread = alertNotifications.filter((a) => !a.isRead).length;

  const donutData = Object.entries(breakdown).map(([k, v]) => ({
    name: LEVEL_LABEL[k] ?? k,
    value: v,
    color: LEVEL_COLOR[k],
  }));

  // 24時間 模擬発生数（mock 配列の作成時刻から逆算した擬似データ）
  const trendData = Array.from({ length: 12 }).map((_, i) => {
    const hour = i * 2;
    return {
      label: `${hour}:00`,
      count: i === 4 ? 1 : i === 5 ? 2 : i === 6 ? 0 : i % 2 === 0 ? 1 : 0,
    };
  });

  const aiAlerts = alertNotifications.filter((a) => a.source === "ai");
  const manualAlerts = alertNotifications.filter((a) => a.source !== "ai");

  return (
    <PageShell
      mode="admin"
      title="連携・アラート"
      subtitle="重要度・経時推移・AI 検知デモ"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "連携・アラート" },
      ]}
    >
      <DemoDisclaimer variant="banner" context="ai" />

      <section className="mt-4 grid gap-3 md:grid-cols-3">
        <StatCard
          label="総アラート"
          value={total}
          unit="件"
          icon={BellRing}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="未読"
          value={unread}
          unit="件"
          icon={AlertTriangle}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
          highlight={unread > 0 ? "warning" : "default"}
        />
        <StatCard
          label="重大"
          value={breakdown.critical ?? 0}
          unit="件"
          icon={AlertTriangle}
          iconBg="bg-red-100"
          iconColor="text-red-700"
          highlight={(breakdown.critical ?? 0) > 0 ? "danger" : "default"}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="重要度別 内訳">
          <DonutChart
            data={donutData}
            centerLabel="件"
            centerValue={`${total}`}
          />
        </ChartCard>
        <ChartCard
          title="24h 発生推移（デモ）"
          subtitle="2時間ごとの発生数"
          className="lg:col-span-2"
        >
          <LineChartCard
            data={trendData}
            series={[{ key: "count", label: "発生数", color: ADMIN_COLORS.primary }]}
            xKey="label"
            height={220}
            yUnit="件"
          />
        </ChartCard>
      </section>

      {manualAlerts.length > 0 ? (
        <section className="mt-6">
          <ChartCard
            title="手動アラート"
            subtitle={`${manualAlerts.length} 件`}
          >
            <ul className="space-y-3">
              {manualAlerts.map((item) => {
                const project = projects.find((p) => p.id === item.projectId);
                return (
                  <li
                    key={item.id}
                    className={`rounded-lg border p-3 ${
                      item.level === "critical"
                        ? "border-red-200 bg-red-50"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded px-2 py-0.5 text-xs font-bold text-white"
                        style={{ backgroundColor: LEVEL_COLOR[item.level] }}
                      >
                        {LEVEL_LABEL[item.level] ?? item.level}
                      </span>
                      <p className="font-bold text-zinc-900">{item.title}</p>
                    </div>
                    <p className="text-xs text-zinc-500">{project?.projectName}</p>
                    <p className="mt-1 text-sm text-zinc-800">{item.message}</p>
                  </li>
                );
              })}
            </ul>
          </ChartCard>
        </section>
      ) : null}

      <section className="mt-6">
        <FutureFeatureBadge
          label="将来実装予定 — AI 検知"
          description="画像解析と過去ログ照合をベースにした AI アラート。Phase 2 後に DB と連動して実装。"
        >
          <div className="space-y-3 p-4">
            {aiAlerts.length === 0 ? (
              <p className="py-4 text-center text-sm text-zinc-500">
                AI 検知のサンプルがありません
              </p>
            ) : (
              aiAlerts.map((item) => {
                const project = projects.find((p) => p.id === item.projectId);
                return (
                  <article
                    key={item.id}
                    className={`rounded-lg border p-3 ${
                      item.level === "critical"
                        ? "border-red-200 bg-red-50"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-800">
                        <Sparkles className="h-3 w-3" />
                        AI
                      </span>
                      <span
                        className="rounded px-2 py-0.5 text-xs font-bold text-white"
                        style={{ backgroundColor: LEVEL_COLOR[item.level] }}
                      >
                        {LEVEL_LABEL[item.level] ?? item.level}
                      </span>
                      <p className="font-bold text-zinc-900">{item.title}</p>
                    </div>
                    <p className="text-xs text-zinc-500">{project?.projectName}</p>
                    <p className="mt-1 text-sm text-zinc-800">{item.message}</p>
                    {item.aiEvidence ? (
                      <div className="mt-2 rounded-md border border-sky-200 bg-sky-50 p-2 text-xs text-sky-950">
                        <p className="font-bold text-sky-900">AI 参照根拠</p>
                        <p className="mt-1">ルール: {item.aiEvidence.ruleLabel}</p>
                        {item.aiEvidence.matchedKeywords?.length ? (
                          <p>キーワード: {item.aiEvidence.matchedKeywords.join("、")}</p>
                        ) : null}
                        <p className="mt-1 leading-relaxed">{item.aiEvidence.detail}</p>
                      </div>
                    ) : null}
                  </article>
                );
              })
            )}
          </div>
        </FutureFeatureBadge>
      </section>
    </PageShell>
  );
}
