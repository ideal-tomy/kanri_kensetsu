import { BottomNav } from "@/components/nav/bottom-nav";
import { ReportForm } from "@/components/report/report-form";
import { state } from "@/lib/prototype-store";

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-zinc-100 p-4 pb-24">
      <div className="mx-auto max-w-3xl space-y-4">
        <ReportForm />
        <section className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-xl font-bold">日報のきろく</h2>
          {state.reports.length === 0 ? <p className="text-sm text-zinc-600">まだありません</p> : null}
          {state.reports.map((report) => (
            <article key={report.id} className="rounded-lg border border-zinc-200 p-3">
              <p className="font-semibold">{report.authorName} さん</p>
              <p className="text-sm text-zinc-600">{new Date(report.createdAt).toLocaleString("ja-JP")}</p>
              <p className="mt-2 text-sm">{report.rawText}</p>
              <p className="mt-2 text-sm font-semibold">人数合計: {report.parsed.total}人</p>
            </article>
          ))}
        </section>
      </div>
      <BottomNav />
    </main>
  );
}
