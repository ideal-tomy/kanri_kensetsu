import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { requireAdminSession } from "@/lib/auth/admin";
import { hydrateDemoEvents } from "@/lib/persist/hydrate";
import { getPhotoById, state } from "@/lib/prototype-store";
import { CATEGORY_LABEL } from "@/lib/admin-theme";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PhotoDetailPage({ params }: Props) {
  const adminUser = await requireAdminSession();
  await hydrateDemoEvents(adminUser.companyCode);
  const { id } = await params;
  const photo = getPhotoById(id);
  if (!photo) return notFound();

  const site = state.sites.find((s) => s.id === photo.siteId);

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
      <section className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="aspect-video bg-zinc-100">
          {photo.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.imageUrl}
              alt={photo.title ?? photo.fileName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              画像なし
            </div>
          )}
        </div>
        <div className="space-y-2 p-5 text-sm text-zinc-700">
          <p>
            <span className="font-semibold text-zinc-900">タイトル:</span>{" "}
            {photo.title ?? photo.fileName}
          </p>
          <p>
            <span className="font-semibold text-zinc-900">カテゴリ:</span>{" "}
            {CATEGORY_LABEL[photo.category]}
          </p>
          <p>
            <span className="font-semibold text-zinc-900">現場:</span>{" "}
            {site?.name ?? photo.siteId}
          </p>
          <p>
            <span className="font-semibold text-zinc-900">投稿者:</span> {photo.userName}
          </p>
          <p>
            <span className="font-semibold text-zinc-900">日時:</span>{" "}
            {new Date(photo.createdAt).toLocaleString("ja-JP")}
          </p>
          {photo.note ? (
            <p>
              <span className="font-semibold text-zinc-900">補足:</span> {photo.note}
            </p>
          ) : null}
          <p className="text-xs text-zinc-500">保管パス: {photo.storagePath}</p>
        </div>
      </section>
    </PageShell>
  );
}
