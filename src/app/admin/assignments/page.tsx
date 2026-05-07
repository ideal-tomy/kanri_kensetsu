import Link from "next/link";
import { AlertTriangle, Calendar, Users } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { StatCard } from "@/components/viz/StatCard";
import { WeekCalendar } from "@/components/personnel/week-calendar";
import { FutureFeatureBadge } from "@/components/common/FutureFeatureBadge";
import { assignments as mockAssignments, projects, workers } from "@/data/mock";
import { state } from "@/lib/prototype-store";
import { ADMIN_COLORS } from "@/lib/admin-theme";

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function AssignmentsPage() {
  // ライブの週カレンダー（prototype-store の assignments）
  const liveSites = state.sites.map((s) => ({ id: s.id, name: s.name }));
  const liveAssignments = state.assignments;

  // mock の AI スコア表示
  const breakdown = mockAssignments.reduce<Record<string, number>>((acc, a) => {
    acc[a.assignmentStatus] = (acc[a.assignmentStatus] ?? 0) + 1;
    return acc;
  }, {});

  const STATUS_LABEL: Record<string, string> = {
    planned: "予定",
    confirmed: "確定",
    changed: "変更あり",
    cancelled: "取消",
  };

  const STATUS_COLOR: Record<string, string> = {
    planned: ADMIN_COLORS.status.notStarted,
    confirmed: ADMIN_COLORS.status.completed,
    changed: ADMIN_COLORS.status.paused,
    cancelled: ADMIN_COLORS.severity.danger,
  };

  const donutData = Object.entries(breakdown).map(([k, v]) => ({
    name: STATUS_LABEL[k] ?? k,
    value: v,
    color: STATUS_COLOR[k],
  }));

  const alarmCount = mockAssignments.filter(
    (a) => a.dispatchAlarmLevel && a.dispatchAlarmLevel !== "none",
  ).length;

  return (
    <PageShell
      mode="admin"
      title="配員最適化"
      subtitle="週カレンダーと AI 配員アラーム（デモ）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "配員最適化" },
      ]}
    >
      <DemoDisclaimer variant="banner" context="dispatch" />

      <section className="mt-4 grid gap-3 md:grid-cols-3">
        <StatCard
          label="総配員"
          value={mockAssignments.length}
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
          label="アラーム"
          value={alarmCount}
          unit="件"
          icon={AlertTriangle}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
          highlight={alarmCount > 0 ? "warning" : "default"}
        />
      </section>

      <section className="mt-6">
        <ChartCard
          title="今週の配員カレンダー"
          subtitle="現場 × 曜日（ライブ）"
        >
          <WeekCalendar
            sites={liveSites}
            assignments={liveAssignments}
            todayStr={todayStr()}
          />
        </ChartCard>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="配員ステータス内訳（mock）">
          <DonutChart
            data={donutData}
            centerLabel="件"
            centerValue={`${mockAssignments.length}`}
          />
        </ChartCard>

        <div className="lg:col-span-2">
          <FutureFeatureBadge
            label="将来実装予定 — AI 配員スコア"
            description="メモ・履歴照合をベースにした AI 推奨スコアと配置アラームのデモ。Phase 2 後の実装でデータベース連動します。"
          >
            <div className="space-y-3 p-4">
              {mockAssignments.map((item) => {
                const project = projects.find((p) => p.id === item.projectId);
                const worker = workers.find((w) => w.id === item.workerId);
                const alarm = item.dispatchAlarmLevel && item.dispatchAlarmLevel !== "none";
                return (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-3 ${
                      alarm
                        ? "border-amber-300 bg-amber-50/90"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    {alarm ? (
                      <div className="mb-2 flex items-start gap-2 rounded-md border border-amber-200 bg-white/80 p-2 text-xs text-amber-950">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        <div>
                          <p className="font-bold">配置アラーム</p>
                          <p className="mt-0.5 text-amber-900">
                            {item.alarmRuleLabel ?? "（参照）"}
                          </p>
                          <p className="mt-1 leading-relaxed">{item.alarmEvidence}</p>
                        </div>
                      </div>
                    ) : null}
                    <p className="font-bold text-zinc-900">
                      {worker?.name} → {project?.projectName}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {item.date} ・ {item.shift === "day" ? "日勤" : "夜勤"} ・ {STATUS_LABEL[item.assignmentStatus]}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800">
                        AI {item.aiScore ?? "-"}
                      </span>
                      <span className="text-xs text-zinc-600">{item.aiReason ?? "手動設定"}</span>
                    </div>
                    {item.manualOverrideReason ? (
                      <p className="mt-2 rounded bg-amber-100 px-2 py-1 text-xs text-amber-900">
                        手動上書き: {item.manualOverrideReason}
                      </p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-3 text-xs">
                      <Link
                        href={`/admin/workers/${item.workerId}`}
                        className="font-medium text-primary underline"
                      >
                        作業員詳細
                      </Link>
                      <Link href="/admin/alerts" className="font-medium text-primary underline">
                        アラート一覧
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </FutureFeatureBadge>
        </div>
      </section>
    </PageShell>
  );
}
