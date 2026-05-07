import Link from "next/link";
import {
  AlertTriangle,
  BellRing,
  Camera,
  FileAudio,
  FileText,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { ChartCard } from "@/components/charts/ChartCard";
import { BarList } from "@/components/charts/BarList";
import { StatCard } from "@/components/viz/StatCard";
import { PhotoGalleryGrid } from "@/components/viz/PhotoGalleryGrid";
import { TimelineList, type TimelineItem } from "@/components/viz/TimelineList";
import { requireAdminSession } from "@/lib/auth/admin";
import {
  buildSiteNameMap,
  getDailyTrend,
  getPhotoUploaderRanking,
  getRecentActivities,
} from "@/lib/admin-stats";
import { getPhotoReportsForUser, state } from "@/lib/prototype-store";
import { ADMIN_COLORS } from "@/lib/admin-theme";
import {
  generatedReportPreviews,
  projects,
  reportPhotos,
  voiceReports,
  workers,
} from "@/data/mock";

export default async function FieldReportsPage() {
  const adminUser = await requireAdminSession();
  const livePhotos = getPhotoReportsForUser(adminUser);
  const siteNameMap = buildSiteNameMap();
  const trend = getDailyTrend(14);
  const ranking = getPhotoUploaderRanking(livePhotos, 5);
  const activities = getRecentActivities(8);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = livePhotos.filter((p) => p.createdAt.slice(0, 10) === today).length;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekCount = livePhotos.filter((p) => p.createdAt >= sevenDaysAgo.toISOString()).length;
  const progressCount = livePhotos.filter((p) => p.category === "progress").length;
  const regularCount = livePhotos.filter((p) => p.category === "regular").length;

  const photoSpark = trend.map((t) => ({ value: t.photos }));
  const reportSpark = trend.map((t) => ({ value: t.reports }));

  const timelineItems: TimelineItem[] = activities.map((a) => ({
    id: a.id,
    title: a.title,
    body: a.body,
    meta: a.meta,
    timestamp: a.timestamp,
    type: a.type,
    severity: a.type === "notification" ? "warning" : "info",
  }));

  return (
    <PageShell
      mode="admin"
      title="現場報告確認"
      subtitle="ワーカー投稿が届いたらここに集約されます"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "現場報告確認" },
      ]}
    >
      <DemoDisclaimer variant="banner" context="ai" />

      <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="今日の写真"
          value={todayCount}
          unit="枚"
          icon={Camera}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
          spark={photoSpark}
          sparkColor={ADMIN_COLORS.primary}
          hint={`定例 ${regularCount} / 進捗 ${progressCount}`}
        />
        <StatCard
          label="今週の合計"
          value={weekCount}
          unit="件"
          icon={FileText}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
          hint="直近7日のワーカー投稿"
        />
        <StatCard
          label="音声日報（mock）"
          value={voiceReports.length}
          unit="件"
          icon={FileAudio}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
          spark={reportSpark}
          sparkColor={ADMIN_COLORS.status.completed}
          hint="AI整形済み"
        />
        <StatCard
          label="未読アラート"
          value={state.notifications.length}
          unit="件"
          icon={BellRing}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
          highlight={state.notifications.length > 0 ? "warning" : "default"}
          hint="通知センター"
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="現場からの写真"
          subtitle={`ライブ ${livePhotos.length} 件 — ワーカー / 監督が投稿した最新`}
          className="lg:col-span-2"
          action={
            <Link
              href="/admin/reports/photos"
              className="text-xs font-medium text-primary underline"
            >
              写真ハブへ →
            </Link>
          }
        >
          <PhotoGalleryGrid
            photos={livePhotos}
            siteNameById={siteNameMap}
            showFilter
            columns={3}
          />
        </ChartCard>

        <ChartCard
          title="投稿者ランキング"
          subtitle="累計件数（写真）"
        >
          <BarList data={ranking} unit="枚" />
        </ChartCard>
      </section>

      <section className="mt-6">
        <ChartCard title="現場アクティビティ（時系列）" subtitle="写真・進捗更新・日報・通知の混合">
          <TimelineList items={timelineItems} />
        </ChartCard>
      </section>

      <section className="mt-6">
        <details className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            参考：以前の管理画面サンプル（mockデータ。Phase 2 で置き換え予定）
          </summary>
          <div className="mt-4 space-y-4">
            {reportPhotos.map((photo) => {
              const project = projects.find((p) => p.id === photo.projectId);
              const worker = workers.find((w) => w.id === photo.uploadedByWorkerId);
              const pairedVoice = voiceReports.find((v) => v.projectId === photo.projectId);
              const draft = generatedReportPreviews.find(
                (d) => d.projectId === photo.projectId && d.kind === "site_daily",
              );
              return (
                <article
                  key={photo.id}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                >
                  <p className="text-xs text-zinc-500">{photo.capturedAt}</p>
                  <p className="font-semibold text-zinc-900">{project?.projectName}</p>
                  <p className="text-sm text-zinc-700">
                    担当: {worker?.name} / 写真: {photo.renamedFileName}
                  </p>
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
        </details>
      </section>
    </PageShell>
  );
}
