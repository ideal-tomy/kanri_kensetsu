import { notFound } from "next/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { ProgressRing } from "@/components/viz/ProgressRing";
import { GanttBar, type GanttRow } from "@/components/viz/GanttBar";
import { PhotoGalleryGrid } from "@/components/viz/PhotoGalleryGrid";
import { StatusBadge } from "@/components/viz/StatusBadge";
import { state } from "@/lib/prototype-store";
import {
  buildSiteNameMap,
  getSiteTaskMix,
} from "@/lib/admin-stats";
import { ADMIN_COLORS } from "@/lib/admin-theme";
import { blueprints, contractors, projects, scheduleTasks, workers } from "@/data/mock";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);
  if (!project) return notFound();

  const projectWorkers = workers.filter((w) => w.currentProjectId === id);
  const projectContractors = contractors.filter((c) =>
    c.activeProjectIds.includes(id),
  );
  const projectBlueprints = blueprints.filter((b) => b.projectId === id);
  const ganttItems = scheduleTasks.filter((t) => t.projectId === id);

  // prototype-store とのマッチング（現場名で照合：ID統一は Phase 2 で完全解消）
  const matchedSite = state.sites.find((s) => s.name.includes(project.projectName.slice(0, 3)));
  const liveTasks = matchedSite ? state.tasks.filter((t) => t.siteId === matchedSite.id) : [];
  const livePhotos = matchedSite
    ? state.photoReports.filter((p) => p.siteId === matchedSite.id)
    : [];
  const liveMix = matchedSite ? getSiteTaskMix(matchedSite.id) : null;
  const siteNameMap = buildSiteNameMap();

  // ガント行：mock の scheduleTasks をベースに、in_progress の場合は仮の進捗％を当てる
  const ganttRows: GanttRow[] = ganttItems.map((t) => ({
    id: t.id,
    label: t.label,
    startOffsetPercent: t.startOffsetPercent,
    widthPercent: t.widthPercent,
    status:
      t.status === "done"
        ? "completed"
        : t.status === "in_progress"
          ? "in_progress"
          : "not_started",
    progressPercent:
      t.status === "done" ? 100 : t.status === "in_progress" ? 60 : 0,
  }));

  // 工程別進捗（mock ガントの現状を BarChart 化）
  const ganttBar = ganttItems.map((t) => ({
    name: t.label,
    progress:
      t.status === "done" ? 100 : t.status === "in_progress" ? 60 : 0,
  }));

  // 進行中タスクの本日の完了率（live data）
  const taskBar = liveTasks.map((t) => ({
    name: t.title,
    progress: t.progressPct,
    actual: t.actualQty,
    planned: t.plannedQty ?? 0,
  }));

  return (
    <PageShell
      mode="admin"
      title={project.projectName}
      subtitle="案件詳細"
      listHref="/admin/projects"
      listLabel="案件一覧へ"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "現場案件", href: "/admin/projects" },
        { label: project.projectName },
      ]}
    >
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3 text-primary">
            <MapPin className="h-5 w-5 shrink-0" aria-hidden />
            <div className="flex-1">
              <p className="text-sm font-bold text-zinc-900">現場住所</p>
              <p className="text-sm text-zinc-700">{project.siteAddress}</p>
              <p className="mt-1 text-xs text-zinc-500">
                発注: {project.clientName} ／ コード: {project.projectCode}
              </p>
            </div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-zinc-50 p-3">
              <p className="text-xs text-zinc-500">開始</p>
              <p className="font-bold text-zinc-900 inline-flex items-center gap-1">
                <Calendar className="h-4 w-4 text-zinc-500" />
                {project.startDate}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3">
              <p className="text-xs text-zinc-500">完了予定</p>
              <p className="font-bold text-zinc-900 inline-flex items-center gap-1">
                <Calendar className="h-4 w-4 text-zinc-500" />
                {project.endDate}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3">
              <p className="text-xs text-zinc-500">担当人数</p>
              <p className="font-bold text-zinc-900 inline-flex items-center gap-1">
                <Users className="h-4 w-4 text-zinc-500" />
                {projectWorkers.length}名
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-zinc-500">全体進捗</p>
          <ProgressRing value={project.progressPercent ?? 0} size={132} thickness={14} />
          <p className="mt-2 text-sm font-bold text-zinc-900">
            {project.progressPercent}% 完了
          </p>
          {liveMix ? (
            <p className="mt-1 text-xs text-zinc-500">
              ライブ：完了 {liveMix.byStatus.completed} / 進行中 {liveMix.byStatus.in_progress} / 中断 {liveMix.byStatus.paused}
            </p>
          ) : (
            <p className="mt-1 text-xs text-zinc-500">
              実データ未連動（Phase 2 でID統一）
            </p>
          )}
        </div>
      </section>

      <section className="mt-6">
        <ChartCard
          title="工程スケジュール（ガント）"
          subtitle="工程の予定と進捗をひと目で"
        >
          <GanttBar
            rows={ganttRows}
            columns={["開始", "1/4", "1/2", "3/4", "完了"]}
            todayPercent={project.progressPercent}
          />
        </ChartCard>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="工程別 進捗率" subtitle="ガントの各工程を％で">
          <BarChartCard
            data={ganttBar}
            series={[{ key: "progress", label: "進捗率", color: ADMIN_COLORS.primary }]}
            xKey="name"
            layout="vertical"
            yUnit="%"
            showValues
            height={Math.max(180, ganttBar.length * 40)}
          />
        </ChartCard>

        <ChartCard
          title="ライブタスク（prototype-store）"
          subtitle={
            matchedSite
              ? `${matchedSite.name} のワーカー入力タスク`
              : "現場名でのID照合に該当なし"
          }
        >
          {liveTasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              ライブタスクはありません
            </p>
          ) : (
            <ul className="space-y-2">
              {liveTasks.map((t) => (
                <li
                  key={t.id}
                  className="rounded-lg border border-zinc-100 bg-zinc-50 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-zinc-900">{t.title}</p>
                    <StatusBadge status={t.status} />
                  </div>
                  {t.plannedQty != null ? (
                    <p className="mt-1 text-xs text-zinc-600">
                      {t.actualQty}/{t.plannedQty}
                      {t.unit ?? ""} ・ 進捗 {t.progressPct}%
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-zinc-600">進捗 {t.progressPct}%</p>
                  )}
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full"
                      style={{
                        width: `${t.progressPct}%`,
                        backgroundColor:
                          t.status === "completed"
                            ? ADMIN_COLORS.status.completed
                            : t.status === "paused"
                              ? ADMIN_COLORS.status.paused
                              : ADMIN_COLORS.status.inProgress,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {taskBar.length > 0 ? (
            <div className="mt-4 border-t border-zinc-100 pt-3">
              <BarChartCard
                data={taskBar}
                series={[
                  { key: "progress", label: "進捗率", color: ADMIN_COLORS.status.inProgress },
                ]}
                xKey="name"
                layout="vertical"
                yUnit="%"
                showValues
                height={Math.max(120, taskBar.length * 32)}
              />
            </div>
          ) : null}
        </ChartCard>
      </section>

      <section className="mt-6">
        <ChartCard
          title="直近の現場写真"
          subtitle={
            matchedSite
              ? `${matchedSite.name} の最近の投稿`
              : "現場名でのID照合に該当なし"
          }
        >
          <PhotoGalleryGrid
            photos={livePhotos.slice(0, 6)}
            siteNameById={siteNameMap}
            columns={3}
            showFilter={false}
            emptyText="写真投稿なし"
          />
        </ChartCard>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-zinc-900">協力会社</h2>
          <ul className="mt-2 space-y-1 text-sm text-zinc-700">
            {projectContractors.map((item) => (
              <li key={item.id} className="rounded bg-zinc-50 p-2">
                <p className="font-medium text-zinc-900">{item.companyName}</p>
                <p className="text-xs text-zinc-500">
                  {item.tradeType} ・ {item.contactPerson}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-zinc-900">現場社員</h2>
          <ul className="mt-2 space-y-1 text-sm text-zinc-700">
            {projectWorkers.map((item) => (
              <li key={item.id} className="rounded bg-zinc-50 p-2">
                <p className="font-medium text-zinc-900">{item.name}</p>
                <p className="text-xs text-zinc-500">
                  {item.employmentType === "full_time" ? "正社員" : "契約"} ・ 経験 {item.yearsExperience}年
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-zinc-900">図面</h2>
          <ul className="mt-2 space-y-1 text-sm text-zinc-700">
            {projectBlueprints.map((item) => (
              <li key={item.id} className="rounded bg-zinc-50 p-2">
                <p className="font-medium text-zinc-900">{item.title}</p>
                <p className="text-xs text-zinc-500">改訂 {item.revision}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
