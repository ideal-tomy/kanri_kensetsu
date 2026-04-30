import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import {
  generatedReportPreviews,
  projects,
  reportPhotos,
  voiceReports,
  workers,
} from "@/data/mock";

export default function FieldReportsPage() {
  return (
    <PageShell
      mode="admin"
      title="現場報告確認"
      subtitle="現場入力の確認・承認に集中"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "現場報告確認" },
      ]}
    >
      <DemoDisclaimer variant="banner" context="ai" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">写真入力</h2>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{reportPhotos.length}件</p>
          <p className="text-sm text-zinc-600">本日のアップロード</p>
        </section>
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">音声日報</h2>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{voiceReports.length}件</p>
          <p className="text-sm text-zinc-600">変換済み</p>
        </section>
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">書類ドラフト</h2>
          <p className="mt-1 text-2xl font-bold text-zinc-900">
            {generatedReportPreviews.length}件
          </p>
          <p className="text-sm text-zinc-600">要確認項目あり</p>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">現場からの入力一覧</h2>
          <Link href="/admin/documents" className="text-sm font-medium text-primary underline">
            書類作成ハブへ
          </Link>
        </div>
        <div className="mt-4 space-y-4">
          {reportPhotos.map((photo) => {
            const project = projects.find((p) => p.id === photo.projectId);
            const worker = workers.find((w) => w.id === photo.uploadedByWorkerId);
            const pairedVoice = voiceReports.find((v) => v.projectId === photo.projectId);
            const draft = generatedReportPreviews.find(
              (d) => d.projectId === photo.projectId && d.kind === "site_daily",
            );

            return (
              <article key={photo.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs text-zinc-500">{photo.capturedAt}</p>
                <p className="font-semibold text-zinc-900">{project?.projectName}</p>
                <p className="text-sm text-zinc-700">
                  担当: {worker?.name} / 写真: {photo.renamedFileName}
                </p>
                <p className="mt-1 text-sm text-zinc-600">保存先: {photo.storagePath}</p>
                {pairedVoice ? (
                  <p className="mt-2 text-sm text-zinc-700">
                    音声要約: {pairedVoice.formattedDailyReport}
                  </p>
                ) : null}
                {draft ? (
                  <p className="mt-2 text-sm text-sky-900">
                    書類ドラフト: {draft.title}（要確認 {draft.reviewChecklist.length} 項目）
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
