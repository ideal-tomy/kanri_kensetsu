import { AlertTriangle, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { ProgressRing } from "@/components/viz/ProgressRing";
import { StatCard } from "@/components/viz/StatCard";
import { ADMIN_COLORS } from "@/lib/admin-theme";
import { projects, safetyDocuments } from "@/data/mock";

const STATUS_LABEL: Record<string, string> = {
  submitted: "提出済み",
  pending: "提出待ち",
  missing: "未提出",
};

const STATUS_COLOR: Record<string, string> = {
  submitted: ADMIN_COLORS.status.completed,
  pending: ADMIN_COLORS.status.paused,
  missing: ADMIN_COLORS.severity.danger,
};

export default function SafetyDocsPage() {
  const total = safetyDocuments.length;
  const breakdown = safetyDocuments.reduce<Record<string, number>>((acc, d) => {
    acc[d.status] = (acc[d.status] ?? 0) + 1;
    return acc;
  }, {});

  const submittedRate = total
    ? Math.round(((breakdown.submitted ?? 0) / total) * 100)
    : 0;

  // 案件別 提出率
  type ProjectRate = {
    project: (typeof projects)[number];
    rate: number;
    total: number;
    submitted: number;
  };
  const perProject: ProjectRate[] = [];
  for (const p of projects) {
    const docs = safetyDocuments.filter((d) => d.projectId === p.id);
    if (docs.length === 0) continue;
    const submitted = docs.filter((d) => d.status === "submitted").length;
    perProject.push({
      project: p,
      rate: Math.round((submitted / docs.length) * 100),
      total: docs.length,
      submitted,
    });
  }

  const donutData = Object.entries(breakdown).map(([k, v]) => ({
    name: STATUS_LABEL[k] ?? k,
    value: v,
    color: STATUS_COLOR[k],
  }));

  const missing = safetyDocuments.filter((d) => d.status === "missing");

  return (
    <PageShell
      mode="admin"
      title="安全書類"
      subtitle="提出ステータスと期限超過の警告"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "安全書類" },
      ]}
    >
      <section className="grid gap-3 md:grid-cols-3">
        <StatCard
          label="総数"
          value={total}
          unit="件"
          icon={ShieldCheck}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
        />
        <StatCard
          label="提出率"
          value={submittedRate}
          unit="%"
          highlight={submittedRate < 80 ? "warning" : "success"}
        />
        <StatCard
          label="未提出"
          value={breakdown.missing ?? 0}
          unit="件"
          icon={AlertTriangle}
          iconBg="bg-red-100"
          iconColor="text-red-700"
          highlight={(breakdown.missing ?? 0) > 0 ? "danger" : "default"}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="ステータス内訳">
          <DonutChart
            data={donutData}
            centerLabel="提出率"
            centerValue={`${submittedRate}%`}
          />
        </ChartCard>
        <ChartCard
          title="案件別 提出率"
          subtitle="リング表示"
          className="lg:col-span-2"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {perProject.map((p) => (
              <div
                key={p.project.id}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3"
              >
                <ProgressRing value={p.rate} size={72} thickness={8} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-zinc-900">
                    {p.project.projectName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {p.submitted}/{p.total} 提出
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      {missing.length > 0 ? (
        <section className="mt-6">
          <ChartCard
            title="未提出の警告"
            subtitle={`${missing.length} 件 — 期限超過の可能性`}
          >
            <ul className="space-y-2">
              {missing.map((doc) => {
                const project = projects.find((p) => p.id === doc.projectId);
                return (
                  <li
                    key={doc.id}
                    className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3"
                  >
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <div className="flex-1">
                      <p className="font-bold text-red-900">{doc.docType}</p>
                      <p className="text-xs text-red-800">
                        {project?.projectName} ・ 期限 {doc.requiredByDate}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </ChartCard>
        </section>
      ) : null}

      <section className="mt-6">
        <ChartCard title="個別レコード">
          <ul className="space-y-2">
            {safetyDocuments.map((doc) => {
              const project = projects.find((p) => p.id === doc.projectId);
              return (
                <li
                  key={doc.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3"
                >
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                    style={{
                      backgroundColor: STATUS_COLOR[doc.status] ?? ADMIN_COLORS.primary,
                    }}
                  >
                    {STATUS_LABEL[doc.status] ?? doc.status}
                  </span>
                  <p className="font-bold text-zinc-900">{doc.docType}</p>
                  <p className="text-xs text-zinc-500">
                    {project?.projectName} ・ 期限 {doc.requiredByDate}
                  </p>
                </li>
              );
            })}
          </ul>
        </ChartCard>
      </section>
    </PageShell>
  );
}
