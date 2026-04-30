import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import {
  generatedReportPreviews,
  laborCostLines,
  projects,
} from "@/data/mock";
import { formatCurrency } from "@/lib/format";

export default function AdminDocumentsPage() {
  return (
    <PageShell
      mode="admin"
      title="書類作成ハブ"
      subtitle="AI下書きと要確認項目（デモ）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "書類作成ハブ" },
      ]}
    >
      <DemoDisclaimer variant="banner" context="ai" />
      <div className="mt-6 space-y-10">
        {generatedReportPreviews.map((doc) => {
          const project = projects.find((p) => p.id === doc.projectId);
          return (
            <article
              key={doc.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
            >
              <header className="border-b border-zinc-100 bg-zinc-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {doc.kind === "site_daily"
                    ? "現場報告"
                    : doc.kind === "completion"
                      ? "完工報告"
                      : "労務・原価"}
                </p>
                <h2 className="text-lg font-semibold text-zinc-900">{doc.title}</h2>
                <p className="text-sm text-zinc-600">{project?.projectName}</p>
              </header>
              <div className="grid gap-4 p-4 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-800">入力サマリー</h3>
                  <p className="mt-2 whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">
                    {doc.rawInputSummary}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-800">
                    AIが追記した下書き
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-zinc-800">
                    {doc.aiExpandedDraft}
                  </p>
                </div>
              </div>
              <div className="border-t border-zinc-100 bg-amber-50/80 px-4 py-3">
                <h3 className="text-sm font-semibold text-amber-950">要確認チェックリスト</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-950">
                  {doc.reviewChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}

        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">労務費サマリー（人日×単価）</h2>
          <p className="mt-1 text-sm text-zinc-600">
            現場ごとの概算。請求見込みとは別軸のデモ集計です。
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
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
                      <td className="py-2 font-medium text-zinc-900">
                        {formatCurrency(sub)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            数値は架空です。実運用では就業規則・協力会社契約と突合してください。
          </p>
        </section>

        <p className="text-center text-sm">
          <Link href="/admin/field-reports" className="font-medium text-primary underline">
            現場報告確認ページへ
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
