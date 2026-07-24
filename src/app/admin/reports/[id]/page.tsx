import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { PhotoGalleryGrid } from "@/components/viz/PhotoGalleryGrid";
import { requireAdminSession } from "@/lib/auth/admin";
import { hydrateDemoEvents } from "@/lib/persist/hydrate";
import {
  getRelatedPhotosForReport,
  getReportById,
  state,
} from "@/lib/prototype-store";
import { WorkReportPreview } from "@/components/report/work-report-preview";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminReportDetailPage({ params }: Props) {
  const adminUser = await requireAdminSession();
  await hydrateDemoEvents(adminUser.companyCode);
  const { id } = await params;
  const report = getReportById(id);
  if (!report) return notFound();

  const site = state.sites.find((s) => s.id === report.siteId);
  const relatedPhotos = getRelatedPhotosForReport(report);
  const siteNameMap = Object.fromEntries(state.sites.map((s) => [s.id, s.name]));

  return (
    <PageShell
      mode="admin"
      title="日報詳細"
      subtitle={`${report.authorName} / ${site?.name ?? report.siteId}`}
      listHref="/admin/field-reports"
      listLabel="現場報告確認へ"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "現場報告確認", href: "/admin/field-reports" },
        { label: "日報詳細" },
      ]}
    >
      <section className="mt-4 space-y-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
          <p>
            <span className="font-semibold text-zinc-900">投稿者:</span> {report.authorName}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-zinc-900">現場:</span>{" "}
            {site?.name ?? report.siteId}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-zinc-900">受信:</span>{" "}
            {new Date(report.createdAt).toLocaleString("ja-JP")}
          </p>
        </div>

        <WorkReportPreview
          siteName={site?.name ?? report.siteId}
          rawText={report.rawText}
          photos={relatedPhotos.filter((p) => p.imageUrl).map((p) => ({
            label: p.title ?? p.fileName,
            imageUrl: p.imageUrl!,
          }))}
        />

        <div>
          <h2 className="mb-2 text-base font-bold text-zinc-900">関連写真（同現場・直近）</h2>
          <PhotoGalleryGrid
            photos={relatedPhotos}
            siteNameById={siteNameMap}
            showFilter={false}
            columns={3}
            emptyText="関連する写真はまだありません"
            detailHrefTemplate="/admin/reports/photos/{id}"
          />
        </div>

        <details className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-zinc-800">
            原文テキスト
          </summary>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-zinc-800">{report.rawText}</pre>
        </details>
      </section>
    </PageShell>
  );
}
