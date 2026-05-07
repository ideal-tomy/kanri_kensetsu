import { parseReport } from "@/lib/parser/report";
import type { AppRole, SessionUser } from "@/lib/auth/session";

export type UserRole = AppRole;
export type TaskStatus = "not_started" | "in_progress" | "paused" | "completed";
export type AssignmentStatus = "planned" | "confirmed" | "changed" | "cancelled";

export type ShiftType =
  | "day_full"
  | "day_am"
  | "day_pm"
  | "night_full"
  | "night_early"
  | "night_late";

export type PauseReason = "rain" | "material" | "manpower" | "other";
export type PhotoCategory = "regular" | "progress";

export type Site = {
  id: string;
  companyCode: string;
  name: string;
  status: "active" | "completed";
  startedAt?: string;
  endedAt?: string;
  overallProgress: number;
};

export type Report = {
  id: string;
  siteId: string;
  authorName: string;
  rawText: string;
  parsed: ReturnType<typeof parseReport>;
  createdAt: string;
  status: "draft" | "sent";
};

export type Task = {
  id: string;
  siteId: string;
  title: string;
  status: TaskStatus;
  progressPct: number;
  unit?: string;
  plannedQty?: number;
  actualQty: number;
  todayTargetQty?: number;
  pausedReason?: PauseReason;
  updatedAt: string;
};

export type TaskUpdate = {
  id: string;
  taskId: string;
  userName: string;
  qtyDelta?: number;
  qtyAfter?: number;
  statusFrom?: TaskStatus;
  statusTo?: TaskStatus;
  comment?: string;
  createdAt: string;
};

export type Assignment = {
  id: string;
  userName: string;
  siteId: string;
  siteName: string;
  workDate: string;
  shift: ShiftType;
  status: AssignmentStatus;
};

export type AssignmentChange = {
  id: string;
  assignmentId: string;
  reason: string;
  beforeSiteName: string;
  afterSiteName: string;
  acknowledgedBy: string[];
  changedAt: string;
};

export type SiteProgressLog = {
  id: string;
  siteId: string;
  userName: string;
  progressFrom: number;
  progressTo: number;
  comment?: string;
  createdAt: string;
};

export type PhotoReport = {
  id: string;
  siteId: string;
  userName: string;
  category: PhotoCategory;
  fileName: string;
  title?: string;
  note?: string;
  storagePath: string;
  createdAt: string;
};

let idSeq = 100;
const nextId = (prefix: string) => `${prefix}-${idSeq++}`;

const todayIso = () => new Date().toISOString();

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

const dayOffset = (offset: number): string => {
  const monday = new Date(TODAY);
  const day = monday.getDay();
  // 月曜開始（日=0 のときは前週月曜にする）
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff + offset);
  return monday.toISOString().slice(0, 10);
};

const initialSites: Site[] = [
  {
    id: "site-1",
    companyCode: "YMD35",
    name: "A邸新築",
    status: "active",
    startedAt: "2026-04-01",
    endedAt: "2026-08-31",
    overallProgress: 42,
  },
  {
    id: "site-2",
    companyCode: "YMD35",
    name: "Bビル改修",
    status: "active",
    startedAt: "2026-03-15",
    endedAt: "2026-09-30",
    overallProgress: 68,
  },
  {
    id: "site-3",
    companyCode: "YMD35",
    name: "Cマンション",
    status: "active",
    startedAt: "2026-04-20",
    endedAt: "2026-11-30",
    overallProgress: 15,
  },
];

const initialTasks: Task[] = [
  {
    id: "task-1",
    siteId: "site-1",
    title: "外壁ボード貼り",
    status: "in_progress",
    progressPct: 51,
    unit: "枚",
    plannedQty: 35,
    actualQty: 18,
    todayTargetQty: 12,
    updatedAt: todayIso(),
  },
  {
    id: "task-2",
    siteId: "site-1",
    title: "基礎配筋",
    status: "completed",
    progressPct: 100,
    unit: "本",
    plannedQty: 120,
    actualQty: 120,
    updatedAt: todayIso(),
  },
  {
    id: "task-3",
    siteId: "site-1",
    title: "床コンクリート",
    status: "not_started",
    progressPct: 0,
    unit: "m²",
    plannedQty: 80,
    actualQty: 0,
    updatedAt: todayIso(),
  },
  {
    id: "task-4",
    siteId: "site-2",
    title: "足場点検",
    status: "paused",
    progressPct: 25,
    actualQty: 0,
    pausedReason: "rain",
    updatedAt: todayIso(),
  },
  {
    id: "task-5",
    siteId: "site-3",
    title: "型枠調整",
    status: "in_progress",
    progressPct: 30,
    unit: "箇所",
    plannedQty: 20,
    actualQty: 6,
    updatedAt: todayIso(),
  },
];

type SeedAssign = {
  userName: string;
  siteId: string;
  siteName: string;
  shift: ShiftType;
  days: number[]; // 0=月..6=日
};

const seedAssigns: SeedAssign[] = [
  {
    userName: "田中さん",
    siteId: "site-1",
    siteName: "A邸新築",
    shift: "day_full",
    days: [0, 1, 3, 4],
  },
  {
    userName: "佐藤さん",
    siteId: "site-1",
    siteName: "A邸新築",
    shift: "day_full",
    days: [0, 1, 3],
  },
  {
    userName: "鈴木さん",
    siteId: "site-2",
    siteName: "Bビル改修",
    shift: "night_full",
    days: [0, 1, 2, 4, 5],
  },
  {
    userName: "山田さん",
    siteId: "site-3",
    siteName: "Cマンション",
    shift: "day_full",
    days: [1, 2, 3, 4],
  },
];

const initialAssignments: Assignment[] = seedAssigns.flatMap((seed) =>
  seed.days.map((d) => ({
    id: nextId("as"),
    userName: seed.userName,
    siteId: seed.siteId,
    siteName: seed.siteName,
    workDate: dayOffset(d),
    shift: seed.shift,
    status: "planned" as AssignmentStatus,
  })),
);

const hoursAgoIso = (h: number): string => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - h * 60);
  return d.toISOString();
};

const daysAgoIso = (days: number, hour = 9): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

const initialPhotoReports: PhotoReport[] = [
  {
    id: nextId("photo"),
    siteId: "site-1",
    userName: "田中さん",
    category: "progress",
    fileName: "exterior_north.jpg",
    title: "北面 外壁ボード貼り 進捗",
    note: "10枚目まで完了。明日12枚張り終え予定。",
    storagePath: "/photos/A邸新築/today/progress/exterior_north.jpg",
    createdAt: hoursAgoIso(2),
  },
  {
    id: nextId("photo"),
    siteId: "site-1",
    userName: "田中さん",
    category: "regular",
    fileName: "morning_briefing.jpg",
    storagePath: "/photos/A邸新築/today/regular/morning_briefing.jpg",
    createdAt: hoursAgoIso(6),
  },
  {
    id: nextId("photo"),
    siteId: "site-1",
    userName: "佐藤さん",
    category: "progress",
    fileName: "scaffold_check.jpg",
    title: "足場の固定確認",
    note: "金具の緩みなし。",
    storagePath: "/photos/A邸新築/today/progress/scaffold_check.jpg",
    createdAt: hoursAgoIso(4),
  },
  {
    id: nextId("photo"),
    siteId: "site-2",
    userName: "鈴木さん",
    category: "regular",
    fileName: "site_morning.jpg",
    storagePath: "/photos/Bビル改修/today/regular/site_morning.jpg",
    createdAt: hoursAgoIso(8),
  },
  {
    id: nextId("photo"),
    siteId: "site-2",
    userName: "鈴木さん",
    category: "progress",
    fileName: "wall_paint.jpg",
    title: "1階壁面塗装 完了",
    note: "想定より早く完了。",
    storagePath: "/photos/Bビル改修/today/progress/wall_paint.jpg",
    createdAt: hoursAgoIso(1),
  },
  {
    id: nextId("photo"),
    siteId: "site-3",
    userName: "山田さん",
    category: "regular",
    fileName: "cmansion_morning.jpg",
    storagePath: "/photos/Cマンション/today/regular/cmansion_morning.jpg",
    createdAt: hoursAgoIso(7),
  },
  {
    id: nextId("photo"),
    siteId: "site-3",
    userName: "山田さん",
    category: "progress",
    fileName: "form_setup.jpg",
    title: "型枠調整 6/20箇所",
    storagePath: "/photos/Cマンション/today/progress/form_setup.jpg",
    createdAt: hoursAgoIso(3),
  },
  {
    id: nextId("photo"),
    siteId: "site-1",
    userName: "田中さん",
    category: "progress",
    fileName: "yesterday_wall.jpg",
    title: "外壁ボード貼り 8枚完了",
    storagePath: "/photos/A邸新築/yesterday/progress/yesterday_wall.jpg",
    createdAt: daysAgoIso(1, 16),
  },
  {
    id: nextId("photo"),
    siteId: "site-2",
    userName: "鈴木さん",
    category: "progress",
    fileName: "yesterday_floor.jpg",
    title: "床仕上げ 2区画完了",
    storagePath: "/photos/Bビル改修/yesterday/progress/yesterday_floor.jpg",
    createdAt: daysAgoIso(1, 17),
  },
];

const initialTaskUpdates: TaskUpdate[] = [
  {
    id: nextId("tu"),
    taskId: "task-1",
    userName: "田中さん",
    qtyDelta: 5,
    qtyAfter: 18,
    statusTo: "in_progress",
    createdAt: hoursAgoIso(2),
  },
  {
    id: nextId("tu"),
    taskId: "task-1",
    userName: "佐藤さん",
    qtyDelta: 3,
    qtyAfter: 13,
    statusTo: "in_progress",
    createdAt: hoursAgoIso(5),
  },
  {
    id: nextId("tu"),
    taskId: "task-4",
    userName: "鈴木さん",
    statusFrom: "in_progress",
    statusTo: "paused",
    comment: "rain",
    qtyAfter: 0,
    createdAt: hoursAgoIso(3),
  },
  {
    id: nextId("tu"),
    taskId: "task-5",
    userName: "山田さん",
    qtyDelta: 2,
    qtyAfter: 6,
    statusTo: "in_progress",
    createdAt: hoursAgoIso(4),
  },
];

const initialNotifications: {
  id: string;
  userName: string;
  title: string;
  body: string;
  createdAt: string;
}[] = [
  {
    id: nextId("ntf"),
    userName: "鈴木さん",
    title: "雨で作業中断",
    body: "Bビル改修・足場点検が雨のため中断しました",
    createdAt: hoursAgoIso(3),
  },
  {
    id: nextId("ntf"),
    userName: "田中さん",
    title: "進捗報告が届きました",
    body: "A邸新築：外壁ボード貼り 10枚完了",
    createdAt: hoursAgoIso(2),
  },
  {
    id: nextId("ntf"),
    userName: "山田さん",
    title: "作業開始",
    body: "Cマンション 型枠調整に着手",
    createdAt: hoursAgoIso(7),
  },
];

const initialSiteProgressLogs: SiteProgressLog[] = [
  {
    id: nextId("spl"),
    siteId: "site-1",
    userName: "伊藤監督",
    progressFrom: 38,
    progressTo: 42,
    comment: "外壁施工が進んだため",
    createdAt: hoursAgoIso(2),
  },
  {
    id: nextId("spl"),
    siteId: "site-2",
    userName: "伊藤監督",
    progressFrom: 65,
    progressTo: 68,
    comment: "1階塗装完了",
    createdAt: hoursAgoIso(1),
  },
];

export const state = {
  users: [] as SessionUser[],
  sites: initialSites,
  reports: [] as Report[],
  tasks: initialTasks,
  taskUpdates: initialTaskUpdates,
  assignments: initialAssignments,
  assignmentChanges: [] as AssignmentChange[],
  notifications: initialNotifications,
  siteProgressLogs: initialSiteProgressLogs,
  photoReports: initialPhotoReports,
};

export const demoAccounts: Array<{
  companyCode: string;
  name: string;
  role: UserRole;
  label: string;
}> = [
  { companyCode: "YMD35", name: "田中さん", role: "worker", label: "現場（職人）" },
  { companyCode: "YMD35", name: "佐藤さん", role: "worker", label: "現場（職人2）" },
  { companyCode: "YMD35", name: "伊藤監督", role: "supervisor", label: "現場監督" },
  { companyCode: "YMD35", name: "中村花子", role: "admin", label: "内勤管理" },
  { companyCode: "YMD35", name: "山田社長", role: "owner", label: "経営者" },
];

export function loginAs(companyCode: string, name: string): SessionUser {
  const account = demoAccounts.find(
    (item) => item.companyCode === companyCode && item.name === name,
  );
  if (!account) {
    throw new Error("account_not_found");
  }

  const user: SessionUser = {
    id: nextId("user"),
    name: account.name,
    companyCode: account.companyCode,
    role: account.role,
  };
  state.users.push(user);
  return user;
}

const today = () => new Date().toISOString().slice(0, 10);

function accessibleSiteIdsByUser(user: SessionUser): Set<string> {
  if (user.role === "admin" || user.role === "owner") {
    return new Set(state.sites.filter((site) => site.companyCode === user.companyCode).map((s) => s.id));
  }

  if (user.role === "worker") {
    return new Set(
      state.assignments
        .filter((a) => a.userName === user.name && a.workDate === today())
        .map((a) => a.siteId),
    );
  }

  // supervisor は担当現場（デモでは全現場）を閲覧可能
  return new Set(state.sites.map((site) => site.id));
}

export function getSitesForUser(user: SessionUser) {
  const siteIds = accessibleSiteIdsByUser(user);
  return state.sites.filter((site) => siteIds.has(site.id));
}

export function getTasksForUser(user: SessionUser) {
  const siteIds = accessibleSiteIdsByUser(user);
  return state.tasks.filter((task) => siteIds.has(task.siteId));
}

export function getReportsForUser(user: SessionUser) {
  if (user.role === "worker") {
    return state.reports.filter((report) => report.authorName === user.name);
  }
  const siteIds = accessibleSiteIdsByUser(user);
  return state.reports.filter((report) => siteIds.has(report.siteId));
}

export function getPhotoReportsForUser(user: SessionUser, category?: PhotoCategory) {
  const siteIds = accessibleSiteIdsByUser(user);
  const filtered = state.photoReports.filter((item) => siteIds.has(item.siteId));
  if (!category) return filtered;
  return filtered.filter((item) => item.category === category);
}

export function getAssignmentsForUser(user: SessionUser) {
  if (user.role === "worker") {
    return state.assignments.filter((assignment) => assignment.userName === user.name);
  }
  const siteIds = accessibleSiteIdsByUser(user);
  return state.assignments.filter((assignment) => siteIds.has(assignment.siteId));
}

export function createReport(siteId: string, authorName: string, rawText: string) {
  const report: Report = {
    id: nextId("report"),
    siteId,
    authorName,
    rawText,
    parsed: parseReport(rawText),
    createdAt: todayIso(),
    status: "sent",
  };
  state.reports.unshift(report);
  state.notifications.unshift({
    id: nextId("ntf"),
    userName: authorName,
    title: "日報が届きました",
    body: `${authorName}さんが日報を送っています`,
    createdAt: todayIso(),
  });
  return report;
}

export function createPhotoReport(input: {
  siteId: string;
  userName: string;
  category: PhotoCategory;
  fileName: string;
  title?: string;
  note?: string;
}) {
  const site = state.sites.find((item) => item.id === input.siteId);
  const date = new Date().toISOString().slice(0, 10);
  const siteFolder = site?.name ?? input.siteId;
  const storagePath = `/photos/${siteFolder}/${date}/${input.category}/${input.fileName}`;
  const report: PhotoReport = {
    id: nextId("photo"),
    siteId: input.siteId,
    userName: input.userName,
    category: input.category,
    fileName: input.fileName,
    title: input.title,
    note: input.note,
    storagePath,
    createdAt: todayIso(),
  };
  state.photoReports.unshift(report);
  return report;
}

const recalcProgress = (task: Task): number => {
  if (task.plannedQty && task.plannedQty > 0) {
    const ratio = (task.actualQty / task.plannedQty) * 100;
    return Math.max(0, Math.min(100, Math.round(ratio)));
  }
  return task.progressPct;
};

export function updateTask(taskId: string, status: TaskStatus, progressPct: number) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) return null;
  const before = task.status;
  task.status = status;
  task.progressPct = progressPct;
  if (status === "completed" && task.plannedQty != null) {
    task.actualQty = task.plannedQty;
    task.progressPct = 100;
  }
  task.updatedAt = todayIso();
  state.taskUpdates.unshift({
    id: nextId("tu"),
    taskId,
    userName: "現場",
    statusFrom: before,
    statusTo: status,
    qtyAfter: task.actualQty,
    createdAt: todayIso(),
  });
  return task;
}

export function addTaskQuantity(taskId: string, delta: number, userName: string) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) return null;
  const next = Math.max(0, task.actualQty + delta);
  task.actualQty = task.plannedQty != null ? Math.min(task.plannedQty, next) : next;
  task.progressPct = recalcProgress(task);
  if (task.status === "not_started" && task.actualQty > 0) {
    task.status = "in_progress";
  }
  if (task.plannedQty != null && task.actualQty >= task.plannedQty) {
    task.status = "completed";
    task.progressPct = 100;
  }
  task.updatedAt = todayIso();
  state.taskUpdates.unshift({
    id: nextId("tu"),
    taskId,
    userName,
    qtyDelta: delta,
    qtyAfter: task.actualQty,
    statusTo: task.status,
    createdAt: todayIso(),
  });
  return task;
}

export function setTaskInterruption(taskId: string, reason: PauseReason, userName: string) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) return null;
  const before = task.status;
  task.status = "paused";
  task.pausedReason = reason;
  task.updatedAt = todayIso();
  state.taskUpdates.unshift({
    id: nextId("tu"),
    taskId,
    userName,
    statusFrom: before,
    statusTo: "paused",
    comment: reason,
    qtyAfter: task.actualQty,
    createdAt: todayIso(),
  });
  return task;
}

export function applyAssignmentChange(assignmentId: string, afterSiteName: string, reason: string) {
  const assignment = state.assignments.find((item) => item.id === assignmentId);
  if (!assignment) return null;
  const before = assignment.siteName;
  assignment.siteName = afterSiteName;
  assignment.status = "changed";
  const change: AssignmentChange = {
    id: nextId("chg"),
    assignmentId,
    reason,
    beforeSiteName: before,
    afterSiteName,
    acknowledgedBy: [],
    changedAt: todayIso(),
  };
  state.assignmentChanges.unshift(change);
  return change;
}

export function acknowledgeChange(changeId: string, userName: string) {
  const change = state.assignmentChanges.find((item) => item.id === changeId);
  if (!change) return null;
  if (!change.acknowledgedBy.includes(userName)) {
    change.acknowledgedBy.push(userName);
  }
  return change;
}

export function updateSiteProgress(
  siteId: string,
  to: number,
  userName: string,
  comment?: string,
) {
  const site = state.sites.find((item) => item.id === siteId);
  if (!site) return null;
  const from = site.overallProgress;
  const clamped = Math.max(0, Math.min(100, Math.round(to)));
  site.overallProgress = clamped;
  const log: SiteProgressLog = {
    id: nextId("spl"),
    siteId,
    userName,
    progressFrom: from,
    progressTo: clamped,
    comment,
    createdAt: todayIso(),
  };
  state.siteProgressLogs.unshift(log);
  return { site, log };
}
