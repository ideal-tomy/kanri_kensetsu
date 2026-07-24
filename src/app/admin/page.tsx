import Link from "next/link";
import {
  AlertTriangle,
  Camera,
  ClipboardCheck,
  FileText,
  PauseCircle,
} from "lucide-react";
import { ModeHeader } from "@/components/layout/mode-header";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { ChartCard } from "@/components/charts/ChartCard";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { BarList } from "@/components/charts/BarList";
import { StatCard } from "@/components/viz/StatCard";
import { ProgressRing } from "@/components/viz/ProgressRing";
import { PhotoGalleryGrid } from "@/components/viz/PhotoGalleryGrid";
import { TimelineList, type TimelineItem } from "@/components/viz/TimelineList";
import { requireAdminSession } from "@/lib/auth/admin";
import {
  buildSiteNameMap,
  getDailyTrend,
  getPhotoUploaderRanking,
  getRecentActivities,
  getSiteProgressList,
  getTodayLiveStats,
} from "@/lib/admin-stats";
import { ADMIN_COLORS } from "@/lib/admin-theme";
import { hydrateDemoEvents } from "@/lib/persist/hydrate";
import { state } from "@/lib/prototype-store";
import { aiLogs } from "@/data/mock";
import { aiLogTypeClasses, aiLogTypeLabel } from "@/lib/ai-demo";
import { DEMO_BRAND } from "@/config/demo-brand";

export default async function AdminPage() {
  const adminUser = await requireAdminSession();
  await hydrateDemoEvents(adminUser.companyCode);
  const stats = getTodayLiveStats();
  const trend = getDailyTrend(14);
  const siteProgressList = getSiteProgressList(state.sites);
  const ranking = getPhotoUploaderRanking(state.photoReports);
  const recent = getRecentActivities(6, adminUser.companyCode);
  const siteNameMap = buildSiteNameMap();

  const trendSeries = [
    { key: "photos", label: "写真投稿", color: ADMIN_COLORS.primary },
    { key: "taskUpdates", label: "進捗更新", color: ADMIN_COLORS.status.inProgress },
    { key: "reports", label: "日報", color: ADMIN_COLORS.status.completed },
  ];

  const siteBarData = siteProgressList.map((row) => ({
    name: row.site.name,
    progress: row.progressPercent,
  }));

  const photoSpark = trend.map((t) => ({ value: t.photos }));
  const reportSpark = trend.map((t) => ({ value: t.reports }));
  const taskSpark = trend.map((t) => ({ value: t.taskUpdates }));

  const recentItems: TimelineItem[] = recent.map((a) => ({
    id: a.id,
    title: a.title,
    body: a.body,
    meta: a.meta,
    timestamp: a.timestamp,
    type: a.type,
    severity: a.type === "notification" ? "warning" : "info",
    href: a.href,
  }));

  const recentPhotos = state.photoReports.slice(0, 8);

  return (
    <div className="min-h-screen bg-zinc-100">
      <ModeHeader
        current="admin"
        title="現場ダッシュボード"
        subtitle={`${DEMO_BRAND.productName} — ${adminUser.name}さん、現場の今をひと目で。`}
      />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
        <DemoDisclaimer variant="banner" context="ai" />

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="進行中タスク"
            value={stats.inProgressTasks}
            unit="件"
            icon={ClipboardCheck}
            iconBg="bg-blue-100"
            iconColor="text-blue-700"
            spark={taskSpark}
            sparkColor={ADMIN_COLORS.status.inProgress}
            hint={`稼働中の現場: ${stats.activeSites}件`}
          />
          <StatCard
            label="中断中タスク"
            value={stats.pausedTasks}
            unit="件"
            icon={PauseCircle}
            iconBg="bg-amber-100"
            iconColor="text-amber-700"
            highlight={stats.pausedTasks > 0 ? "warning" : "default"}
            hint={stats.pausedTasks > 0 ? "要対応 (雨・材料待ち等)" : "中断はありません"}
          />
          <StatCard
            label="今日の写真"
            value={stats.todayPhotos}
            unit="枚"
            icon={Camera}
            iconBg="bg-orange-100"
            iconColor="text-orange-700"
            spark={photoSpark}
            sparkColor={ADMIN_COLORS.primary}
            hint={`定例 ${stats.weekRegularPhotos} / 進捗 ${stats.weekProgressPhotos}`}
          />
          <StatCard
            label="今日の日報"
            value={stats.todayReports}
            unit="件"
            icon={FileText}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-700"
            spark={reportSpark}
            sparkColor={ADMIN_COLORS.status.completed}
            hint={`完了タスク累計 ${stats.completedTasks}件`}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <ChartCard
            title="この2週間の現場アクティビティ"
            subtitle="写真・進捗更新・日報の日次推移"
            className="lg:col-span-2"
            action={
              <Link
                href="/admin/field-reports"
                className="text-xs font-medium text-primary underline"
              >
                報告を見る →
              </Link>
            }
          >
            <LineChartCard
              data={trend.map((t) => ({
                label: t.label,
                photos: t.photos,
                reports: t.reports,
                taskUpdates: t.taskUpdates,
              }))}
              series={trendSeries}
              xKey="label"
              height={240}
            />
          </ChartCard>

          <ChartCard
            title="現場別 全体進捗率"
            subtitle="現場ごとの完了率（％）"
            action={
              <Link
                href="/admin/sites"
                className="text-xs font-medium text-primary underline"
              >
                現場一覧 →
              </Link>
            }
          >
            <BarChartCard
              data={siteBarData}
              series={[
                { key: "progress", label: "進捗率", color: ADMIN_COLORS.primary },
              ]}
              xKey="name"
              layout="vertical"
              yUnit="%"
              showValues
              height={240}
            />
          </ChartCard>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <ChartCard
            title="現場の今"
            subtitle="直近の投稿写真"
            className="lg:col-span-2"
            action={
              <Link
                href="/admin/reports/photos"
                className="text-xs font-medium text-primary underline"
              >
                すべて見る →
              </Link>
            }
          >
            {recentPhotos.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">
                まだ写真の投稿がありません
              </p>
            ) : (
              <PhotoGalleryGrid
                photos={recentPhotos}
                siteNameById={siteNameMap}
                showFilter={false}
                variant="scroll"
              />
            )}
          </ChartCard>

          <ChartCard
            title="最新の動き"
            subtitle="写真・進捗・日報・通知"
            action={
              <Link
                href="/admin/field-reports"
                className="text-xs font-medium text-primary underline"
              >
                詳細 →
              </Link>
            }
          >
            <TimelineList items={recentItems} />
          </ChartCard>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <ChartCard
            title="投稿者ランキング（写真）"
            subtitle="累計投稿件数"
          >
            <BarList data={ranking} unit="枚" />
          </ChartCard>

          <ChartCard title="現場別 進捗リング" className="lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              {siteProgressList.map((row) => (
                <Link
                  key={row.site.id}
                  href={`/admin/sites`}
                  className="group flex flex-col items-center gap-2 rounded-lg border border-zinc-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <ProgressRing value={row.progressPercent} />
                  <p className="text-sm font-bold text-zinc-900">{row.site.name}</p>
                  <p className="text-xs text-zinc-500">
                    タスク {row.completedTasks}/{row.totalTasks}・写真 {row.photoCount}
                  </p>
                </Link>
              ))}
            </div>
          </ChartCard>
        </section>

        <section className="rounded-xl border border-primary/20 bg-primary-muted/80 p-4 shadow-sm">
          <h2 className="text-base font-bold text-zinc-900">本日の管理フロー</h2>
          <ol className="mt-3 grid gap-3 md:grid-cols-3">
            <li className="rounded-lg border border-zinc-200 bg-white p-3">
              <p className="text-xs text-zinc-500">STEP 1</p>
              <Link href="/admin/alerts" className="font-bold text-primary underline">
                アラート確認
              </Link>
              <p className="mt-1 text-sm text-zinc-600">優先度の高い通知から対応</p>
            </li>
            <li className="rounded-lg border border-zinc-200 bg-white p-3">
              <p className="text-xs text-zinc-500">STEP 2</p>
              <Link href="/admin/assignments" className="font-bold text-primary underline">
                配員判断
              </Link>
              <p className="mt-1 text-sm text-zinc-600">AIアラームを見て確定</p>
            </li>
            <li className="rounded-lg border border-zinc-200 bg-white p-3">
              <p className="text-xs text-zinc-500">STEP 3</p>
              <Link href="/admin/documents" className="font-bold text-primary underline">
                書類確定
              </Link>
              <p className="mt-1 text-sm text-zinc-600">現場報告を最終アウトプット化</p>
            </li>
          </ol>
        </section>

        <ChartCard
          title="AIログ（デモ）"
          subtitle="自動命名・要約・配員アラームのサンプル"
          action={
            <Link
              href="/admin/assignments"
              className="text-xs font-medium text-primary underline"
            >
              配員画面へ →
            </Link>
          }
        >
          <ul className="space-y-2">
            {aiLogs.slice(0, 5).map((log) => (
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

        <details className="rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm">
          <summary className="cursor-pointer font-medium text-zinc-700">
            <AlertTriangle className="mr-1 inline h-4 w-4 text-amber-500" />
            管理者向け詳細（カードナビ）
          </summary>
          <div className="mt-3">
            <p className="text-xs text-zinc-500">
              機能カテゴリ別のショートカット。サイドバーから直接アクセスもできます。
            </p>
          </div>
        </details>
      </main>
    </div>
  );
}
