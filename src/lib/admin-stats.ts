import { state, type PhotoReport, type Site, type Task, type TaskStatus } from "@/lib/prototype-store";

const startOfDayIso = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const isoYmd = (date: Date) => date.toISOString().slice(0, 10);

export function getTodayLiveStats() {
  const today = isoYmd(new Date());
  const tasks = state.tasks;
  const photos = state.photoReports;
  const reports = state.reports;
  return {
    inProgressTasks: tasks.filter((t) => t.status === "in_progress").length,
    pausedTasks: tasks.filter((t) => t.status === "paused").length,
    completedTasks: tasks.filter((t) => t.status === "completed").length,
    todayPhotos: photos.filter((p) => p.createdAt.slice(0, 10) === today).length,
    todayReports: reports.filter((r) => r.createdAt.slice(0, 10) === today).length,
    activeSites: state.sites.filter((s) => s.status === "active").length,
    weekProgressPhotos: photos.filter((p) => p.category === "progress").length,
    weekRegularPhotos: photos.filter((p) => p.category === "regular").length,
  };
}

/**
 * 過去 N 日の日次集計を返す（古い→新しい）。
 */
export function getDailyTrend(days = 14) {
  const now = new Date();
  const buckets: Array<{
    date: string;
    label: string;
    photos: number;
    reports: number;
    taskUpdates: number;
  }> = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dayStart = d.toISOString();
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const dayEnd = next.toISOString();
    const photos = state.photoReports.filter(
      (p) => p.createdAt >= dayStart && p.createdAt < dayEnd,
    ).length;
    const reports = state.reports.filter(
      (r) => r.createdAt >= dayStart && r.createdAt < dayEnd,
    ).length;
    const taskUpdates = state.taskUpdates.filter(
      (tu) => tu.createdAt >= dayStart && tu.createdAt < dayEnd,
    ).length;
    buckets.push({
      date: isoYmd(d),
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      photos,
      reports,
      taskUpdates,
    });
  }
  return buckets;
}

export function getTaskStatusBreakdown(): Record<TaskStatus, number> {
  return state.tasks.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] ?? 0) + 1;
      return acc;
    },
    {
      not_started: 0,
      in_progress: 0,
      paused: 0,
      completed: 0,
    } as Record<TaskStatus, number>,
  );
}

export function getSiteProgressList(sites: Site[]) {
  return sites
    .map((site) => {
      const siteTasks = state.tasks.filter((t) => t.siteId === site.id);
      const completed = siteTasks.filter((t) => t.status === "completed").length;
      const total = siteTasks.length;
      const photoCount = state.photoReports.filter((p) => p.siteId === site.id).length;
      const lastUpdate = siteTasks
        .map((t) => t.updatedAt)
        .sort()
        .pop();
      return {
        site,
        completedTasks: completed,
        totalTasks: total,
        photoCount,
        progressPercent: site.overallProgress,
        lastUpdate,
      };
    })
    .sort((a, b) => b.progressPercent - a.progressPercent);
}

export function getPhotoUploaderRanking(photos: PhotoReport[], limit = 5) {
  const map = new Map<string, number>();
  for (const photo of photos) {
    map.set(photo.userName, (map.get(photo.userName) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function getRecentActivities(limit = 8) {
  const items: Array<{
    id: string;
    type: "photo" | "report" | "task" | "notification";
    title: string;
    body?: string;
    timestamp: string;
    meta?: string;
  }> = [];

  for (const p of state.photoReports.slice(0, 10)) {
    items.push({
      id: p.id,
      type: "photo",
      title: p.title ?? `${p.userName}さんが写真を投稿`,
      body: p.note ?? p.fileName,
      timestamp: p.createdAt,
      meta: `${p.userName} / ${p.category === "regular" ? "定例" : "進捗"}`,
    });
  }
  for (const tu of state.taskUpdates.slice(0, 10)) {
    const task = state.tasks.find((t) => t.id === tu.taskId);
    items.push({
      id: tu.id,
      type: "task",
      title: task ? `${task.title}：${tu.statusTo ?? "更新"}` : "タスク更新",
      body:
        tu.qtyDelta != null
          ? `+${tu.qtyDelta}${task?.unit ?? ""} → 累計 ${tu.qtyAfter ?? "-"}${task?.unit ?? ""}`
          : tu.comment,
      timestamp: tu.createdAt,
      meta: tu.userName,
    });
  }
  for (const r of state.reports.slice(0, 10)) {
    items.push({
      id: r.id,
      type: "report",
      title: `${r.authorName}さんの日報`,
      body: r.rawText.slice(0, 60),
      timestamp: r.createdAt,
    });
  }
  for (const n of state.notifications.slice(0, 10)) {
    items.push({
      id: n.id,
      type: "notification",
      title: n.title,
      body: n.body,
      timestamp: n.createdAt,
      meta: n.userName,
    });
  }

  return items
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .slice(0, limit);
}

export function buildSiteNameMap(): Record<string, string> {
  return state.sites.reduce(
    (acc, site) => {
      acc[site.id] = site.name;
      return acc;
    },
    {} as Record<string, string>,
  );
}

export function getSiteTaskMix(siteId: string) {
  const siteTasks = state.tasks.filter((t) => t.siteId === siteId);
  return {
    total: siteTasks.length,
    byStatus: siteTasks.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] ?? 0) + 1;
        return acc;
      },
      {
        not_started: 0,
        in_progress: 0,
        paused: 0,
        completed: 0,
      } as Record<TaskStatus, number>,
    ),
    averageProgress:
      siteTasks.length === 0
        ? 0
        : Math.round(
            siteTasks.reduce((sum, t) => sum + t.progressPct, 0) / siteTasks.length,
          ),
    tasks: siteTasks,
  };
}

export function lastNDaysFromIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return startOfDayIso(d);
}

export type { Task };
