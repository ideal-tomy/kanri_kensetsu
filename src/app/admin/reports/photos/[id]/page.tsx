import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { projects, reportPhotos, workers } from "@/data/mock";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PhotoDetailPage({ params }: Props) {
  const { id } = await params;
  const photo = reportPhotos.find((item) => item.id === id);
  if (!photo) return notFound();
  const project = projects.find((p) => p.id === photo.projectId);
  const worker = workers.find((w) => w.id === photo.uploadedByWorkerId);

  return (
    <PageShell
      mode="admin"
      title="写真詳細"
      listHref="/admin/reports/photos"
      listLabel="写真一覧へ"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "写真ハブ", href: "/admin/reports/photos" },
        { label: "写真詳細" },
      ]}
    >
      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <p className="text-sm text-zinc-500">案件</p>
        <p className="font-semibold">{project?.projectName}</p>
        <p className="mt-2 text-sm text-zinc-500">撮影者</p>
        <p>{worker?.name}</p>
        <p className="mt-2 text-sm text-zinc-500">元ファイル名</p>
        <p>{photo.originalFileName}</p>
        <p className="mt-2 text-sm text-zinc-500">AI命名後</p>
        <p className="font-medium text-orange-700">{photo.renamedFileName}</p>
        <div className="mt-5 space-y-2 border-t border-zinc-100 pt-4">
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs">
              ✓
            </span>
            指定フォルダに保存しました
          </p>
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs">
              ✓
            </span>
            報告書類の指定個所に、画像を挿入しました
          </p>
        </div>
      </section>
    </PageShell>
  );
}
