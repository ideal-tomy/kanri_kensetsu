import { Camera } from "lucide-react";
import { BottomNav } from "@/components/nav/bottom-nav";
import { PhotoGalleryGrid } from "@/components/viz/PhotoGalleryGrid";
import { StatCard } from "@/components/viz/StatCard";
import { requireSupervisorSession } from "@/lib/auth/admin";
import { getPhotoReportsForUser } from "@/lib/prototype-store";
import { buildSiteNameMap } from "@/lib/admin-stats";
import { ADMIN_COLORS } from "@/lib/admin-theme";

export default async function SupervisorPhotoPage() {
  const user = await requireSupervisorSession();
  const photos = getPhotoReportsForUser(user);
  const siteNameMap = buildSiteNameMap();

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = photos.filter((p) => p.createdAt.slice(0, 10) === today).length;
  const regular = photos.filter((p) => p.category === "regular").length;
  const progress = photos.filter((p) => p.category === "progress").length;

  return (
    <main className="space-y-4 p-4 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900">写真の確認</h1>
        <p className="mt-1 text-sm text-zinc-700">
          担当現場でみんなが撮った写真をまとめて見られます。
        </p>
      </header>

      <section className="grid gap-3 grid-cols-3">
        <StatCard
          label="今日"
          value={todayCount}
          unit="枚"
          icon={Camera}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
          sparkColor={ADMIN_COLORS.primary}
        />
        <StatCard
          label="定例"
          value={regular}
          unit="枚"
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="進捗"
          value={progress}
          unit="枚"
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
        />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <PhotoGalleryGrid
          photos={photos}
          siteNameById={siteNameMap}
          columns={2}
          showFilter
        />
      </section>

      <BottomNav role="supervisor" />
    </main>
  );
}
