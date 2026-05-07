import Link from "next/link";
import { CheckSquare, FileText } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { KanbanBoard, type KanbanColumnDef } from "@/components/viz/KanbanBoard";
import { StatCard } from "@/components/viz/StatCard";
import { ADMIN_COLORS } from "@/lib/admin-theme";
import {
  generatedReportPreviews,
  laborCostLines,
  projects,
} from "@/data/mock";
import { formatCurrency } from "@/lib/format";

const KIND_LABEL: Record<string, string> = {
  site_daily: "現場報告",
  completion: "完工報告",
  labor_summary: "労務・原価",
};

const KIND_COLOR: Record<string, string> = {
  site_daily: ADMIN_COLORS.status.inProgress,
  completion: ADMIN_COLORS.status.completed,
  labor_summary: ADMIN_COLORS.primary,
};

interface DocCard {
  id: string;
  kind: string;
  title: string;
  projectName: string;
  reviewCount: number;
  rawSummary: string;
}

export default function AdminDocumentsPage() {
  const cards: DocCard[] = generatedReportPreviews.map((d) => ({
    id: d.id,
    kind: d.kind,
    title: d.title,
    projectName:
      projects.find((p) => p.id === d.projectId)?.projectName ?? "（不明）",
    reviewCount: d.reviewChecklist.length,
    rawSummary: d.rawInputSummary,
  }));

  const breakdown = cards.reduce<Record<string, number>>((acc, c) => {
    acc[c.kind] = (acc[c.kind] ?? 0) + 1;
    return acc;
  }, {});

  const donutData = Object.entries(breakdown).map(([k, v]) => ({
    name: KIND_LABEL[k] ?? k,
    value: v,
    color: KIND_COLOR[k],
  }));

  // カンバン: ドラフト / 確認待ち / 承認済み — kind を仮ステータスに使う
  const columns: KanbanColumnDef<DocCard>[] = [
    {
      id: "draft",
      label: "ドラフト",
      accent: ADMIN_COLORS.status.notStarted,
      items: cards.filter((c) => c.reviewCount >= 3),
    },
    {
      id: "review",
      label: "確認待ち",
      accent: ADMIN_COLORS.status.paused,
      items: cards.filter((c) => c.reviewCount === 2),
    },
    {
      id: "ready",
      label: "承認準備",
      accent: ADMIN_COLORS.status.inProgress,
      items: cards.filter((c) => c.reviewCount === 1),
    },
    {
      id: "approved",
      label: "承認済み",
      accent: ADMIN_COLORS.status.completed,
      items: cards.filter((c) => c.reviewCount === 0),
    },
  ];

  const totalLaborCost = laborCostLines.reduce(
    (s, line) => s + line.personDays * line.unitCostYen,
    0,
  );

  return (
    <PageShell
      mode="admin"
      title="書類作成ハブ"
      subtitle="AI 下書きと要確認チェックリスト（デモ）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "書類作成ハブ" },
      ]}
    >
      <DemoDisclaimer variant="banner" context="ai" />

      <section className="mt-4 grid gap-3 md:grid-cols-3">
        <StatCard
          label="ドラフト"
          value={cards.length}
          unit="件"
          icon={FileText}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="要確認項目"
          value={cards.reduce((s, c) => s + c.reviewCount, 0)}
          unit="項目"
          icon={CheckSquare}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
        />
        <StatCard
          label="労務費(累計)"
          value={formatCurrency(totalLaborCost)}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="書類種別の構成比">
          <DonutChart
            data={donutData}
            centerLabel="件"
            centerValue={`${cards.length}`}
          />
        </ChartCard>
        <ChartCard title="書類カンバン" className="lg:col-span-2">
          <KanbanBoard
            columns={columns}
            renderItem={(card) => (
              <>
                <span
                  className="inline-block rounded px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ backgroundColor: KIND_COLOR[card.kind] }}
                >
                  {KIND_LABEL[card.kind] ?? card.kind}
                </span>
                <p className="mt-1 text-sm font-bold text-zinc-900">{card.title}</p>
                <p className="text-xs text-zinc-500">{card.projectName}</p>
                <p className="mt-1 text-xs text-zinc-700">
                  要確認 {card.reviewCount} 項目
                </p>
              </>
            )}
          />
        </ChartCard>
      </section>

      <section className="mt-6 space-y-6">
        {generatedReportPreviews.map((doc) => {
          const project = projects.find((p) => p.id === doc.projectId);
          return (
            <article
              key={doc.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
            >
              <header className="border-b border-zinc-100 bg-zinc-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {KIND_LABEL[doc.kind] ?? doc.kind}
                </p>
                <h2 className="text-base font-bold text-zinc-900">{doc.title}</h2>
                <p className="text-sm text-zinc-600">{project?.projectName}</p>
              </header>
              <div className="grid gap-4 p-4 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold text-zinc-800">入力サマリー</h3>
                  <p className="mt-2 whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">
                    {doc.rawInputSummary}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-800">AI が追記した下書き</h3>
                  <p className="mt-2 whitespace-pre-wrap rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-zinc-800">
                    {doc.aiExpandedDraft}
                  </p>
                </div>
              </div>
              <div className="border-t border-zinc-100 bg-amber-50/80 px-4 py-3">
                <h3 className="text-sm font-bold text-amber-950">要確認チェックリスト</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-950">
                  {doc.reviewChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-bold text-zinc-900">労務費サマリー</h2>
        <p className="mt-1 text-sm text-zinc-600">人日 × 単価。請求見込みとは別軸のデモ集計。</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="py-2 pr-4 font-medium">案件</th>
                <th className="py-2 pr-4 font-medium">区分</th>
                <th className="py-2 pr-4 font-medium">人日</th>
                <th className="py-2 pr-4 font-medium">単価</th>
                <th className="py-2 font-medium">小計</th>
              </tr>
            </thead>
            <tbody>
              {laborCostLines.map((row) => {
                const project = projects.find((p) => p.id === row.projectId);
                const sub = row.personDays * row.unitCostYen;
                return (
                  <tr key={row.id} className="border-b border-zinc-100">
                    <td className="py-2 pr-4 text-zinc-800">{project?.projectName}</td>
                    <td className="py-2 pr-4">{row.roleLabel}</td>
                    <td className="py-2 pr-4">{row.personDays}</td>
                    <td className="py-2 pr-4">{formatCurrency(row.unitCostYen)}</td>
                    <td className="py-2 font-bold text-zinc-900">{formatCurrency(sub)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-6 text-center text-sm">
        <Link href="/admin/field-reports" className="font-medium text-primary underline">
          現場報告確認ページへ →
        </Link>
      </p>
    </PageShell>
  );
}
