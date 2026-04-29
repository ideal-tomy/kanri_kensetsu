import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { aiLogs, projects, reportPhotos, workers } from "@/data/mock";

export default function PhotosHubPage() {
  return (
    <PageShell
      mode="admin"
      title="現場報告・写真ハブ"
      subtitle="最新写真とAI命名ログ"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "現場報告・写真ハブ" },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-3">
          {reportPhotos.map((photo) => {
            const project = projects.find((p) => p.id === photo.projectId);
            const worker = workers.find((w) => w.id === photo.uploadedByWorkerId);
            return (
              <Link
                key={photo.id}
                href={`/admin/reports/photos/${photo.id}`}
                className="block rounded-lg border border-zinc-200 bg-white p-4"
              >
                <p className="font-semibold">{photo.renamedFileName}</p>
                <p className="text-sm text-zinc-600">
                  {project?.projectName} / 撮影者: {worker?.name}
                </p>
              </Link>
            );
          })}
        </section>
        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold">AI処理ログ</h2>
          <ul className="mt-3 space-y-2">
            {aiLogs.map((log) => (
              <li key={log.id} className="rounded bg-zinc-50 p-2 text-sm text-zinc-700">
                {log.message}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
