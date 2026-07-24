import Link from "next/link";
import { Camera } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { StatCard } from "@/components/viz/StatCard";
import { PhotoGalleryGrid } from "@/components/viz/PhotoGalleryGrid";
import { requireAdminSession } from "@/lib/auth/admin";
import {
  buildSiteNameMap,
  getDailyTrend,
} from "@/lib/admin-stats";
import { getPhotoReportsForUser, state } from "@/lib/prototype-store";
import { hydrateDemoEvents } from "@/lib/persist/hydrate";
import { ADMIN_COLORS } from "@/lib/admin-theme";
import { aiLogs } from "@/data/mock";
import { aiLogTypeClasses, aiLogTypeLabel } from "@/lib/ai-demo";

export default async function PhotosHubPage() {
  const adminUser = await requireAdminSession();
  await hydrateDemoEvents(adminUser.companyCode);
  const photos = getPhotoReportsForUser(adminUser);
  const siteNameMap = buildSiteNameMap();
  const trend = getDailyTrend(14);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = photos.filter((p) => p.createdAt.slice(0, 10) === today).length;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekCount = photos.filter((p) => p.createdAt >= sevenDaysAgo.toISOString()).length;
  const regular = photos.filter((p) => p.category === "regular").length;
  const progress = photos.filter((p) => p.category === "progress").length;

  // 現場別投稿件数
  const perSite = state.sites
    .map((site) => ({
      name: site.name,
      photos: photos.filter((p) => p.siteId === site.id).length,
    }))
    .sort((a, b) => b.photos - a.photos);

  const photoSpark = trend.map((t) => ({ value: t.photos }));

  return (
    <PageShell
      mode="admin"
      title="施工写真ハブ"
      subtitle="現場で撮影された写真を一覧・絞り込み"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "施工写真ハブ" },
      ]}
    >
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="今日の写真"
          value={todayCount}
          unit="枚"
          icon={Camera}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
          spark={photoSpark}
          sparkColor={ADMIN_COLORS.primary}
        />
        <StatCard
          label="今週の合計"
          value={weekCount}
          unit="件"
          hint="直近7日"
        />
        <StatCard
          label="定例報告"
          value={regular}
          unit="枚"
          hint="毎日のフレッシュ写真"
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="進捗報告"
          value={progress}
          unit="枚"
          hint="タイトル付きで管理"
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="写真一覧"
          subtitle={`${photos.length} 件 — 定例/進捗をフィルタで切替`}
          className="lg:col-span-2"
          action={
            <Link
              href="/admin/field-reports"
              className="text-xs font-medium text-primary underline"
            >
              現場報告確認へ →
            </Link>
          }
        >
          <PhotoGalleryGrid
            photos={photos}
            siteNameById={siteNameMap}
            columns={3}
            detailHrefTemplate="/admin/reports/photos/{id}"
          />
        </ChartCard>

        <ChartCard
          title="現場別 投稿件数"
          subtitle="現場ごとの写真投稿数"
        >
          <BarChartCard
            data={perSite}
            series={[{ key: "photos", label: "枚", color: ADMIN_COLORS.primary }]}
            xKey="name"
            layout="vertical"
            yUnit="枚"
            showValues
            height={Math.max(180, perSite.length * 38)}
          />
        </ChartCard>
      </section>

      <section className="mt-6">
        <ChartCard
          title="AI処理ログ（デモ）"
          subtitle="自動命名・分類のサンプル出力"
        >
          <ul className="space-y-2">
            {aiLogs.slice(0, 6).map((log) => (
              <li
                key={log.id}
                className={`rounded-md border p-3 text-sm ${aiLogTypeClasses(log.type)}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-white/80 px-2 py-0.5 text-xs font-semibold text-zinc-800">
                    {aiLogTypeLabel(log.type)}
                  </span>
                  <span className="text-xs text-zinc-600">{log.timestamp}</span>
                </div>
                <p className="mt-2 font-medium text-zinc-900">{log.message}</p>
              </li>
            ))}
          </ul>
        </ChartCard>
      </section>
    </PageShell>
  );
}
