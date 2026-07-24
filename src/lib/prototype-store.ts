import { parseReport } from "@/lib/parser/report";
import {
  buildAutoFileName,
  buildDemoStoragePath,
  getExteriorSashConfig,
} from "@/lib/demo/exterior-sash-rules";
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

export type AutoProgressSource = "manual" | "photo_count";

export type PhaseProgressMode = "auto" | "manual";

export type ProjectPhase = {
  id: string;
  siteId: string;
  name: string;
  displayOrder: number;
  color?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  progressPct: number;
  progressMode: PhaseProgressMode;
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
  phaseId?: string;
  autoProgressSource?: AutoProgressSource;
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
  /** ギャラリー表示用。`/images/...` または Blob URL */
  imageUrl?: string;
  createdAt: string;
  /** 外壁・サッシデモ：報告書の写真枠ID */
  photoSlotId?: string;
  phaseId?: string;
  phaseLabel?: string;
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

const initialPhases: ProjectPhase[] = [
  {
    id: "phase-s1-1",
    siteId: "site-1",
    name: "基礎工事",
    displayOrder: 1,
    color: "#2563eb",
    plannedStartDate: "2026-04-01",
    plannedEndDate: "2026-04-30",
    progressPct: 100,
    progressMode: "auto",
  },
  {
    id: "phase-s1-2",
    siteId: "site-1",
    name: "躯体工事",
    displayOrder: 2,
    color: "#ea580c",
    plannedStartDate: "2026-05-01",
    plannedEndDate: "2026-06-30",
    progressPct: 51,
    progressMode: "auto",
  },
  {
    id: "phase-s1-3",
    siteId: "site-1",
    name: "内装工事",
    displayOrder: 3,
    color: "#16a34a",
    plannedStartDate: "2026-07-01",
    plannedEndDate: "2026-08-15",
    progressPct: 0,
    progressMode: "auto",
  },
  {
    id: "phase-es1-sash",
    siteId: "site-es-1",
    name: "サッシ取付",
    displayOrder: 1,
    color: "#ea580c",
    plannedStartDate: "2026-05-01",
    plannedEndDate: "2026-05-15",
    progressPct: 60,
    progressMode: "manual",
  },
  {
    id: "phase-es2-wall",
    siteId: "site-es-2",
    name: "外壁補修",
    displayOrder: 1,
    color: "#2563eb",
    plannedStartDate: "2026-04-10",
    plannedEndDate: "2026-07-20",
    progressPct: 35,
    progressMode: "manual",
  },
  {
    id: "phase-es3-cw",
    siteId: "site-es-3",
    name: "カーテンウォール確認",
    displayOrder: 1,
    color: "#059669",
    plannedStartDate: "2026-05-05",
    plannedEndDate: "2026-05-18",
    progressPct: 80,
    progressMode: "manual",
  },
];

const initialSites: Site[] = [
  {
    id: "site-1",
    companyCode: "YMD35",
    name: "新宿駅西口再開発A棟",
    status: "active",
    startedAt: "2026-04-01",
    endedAt: "2026-08-31",
    overallProgress: 42,
  },
  {
    id: "site-2",
    companyCode: "YMD35",
    name: "大手町オフィスタワー改修",
    status: "active",
    startedAt: "2026-03-15",
    endedAt: "2026-09-30",
    overallProgress: 68,
  },
  {
    id: "site-3",
    companyCode: "YMD35",
    name: "豊洲オフィスレジデンス",
    status: "active",
    startedAt: "2026-04-20",
    endedAt: "2026-11-30",
    overallProgress: 15,
  },
  {
    id: "site-es-1",
    companyCode: "YMD35",
    name: "山田邸 サッシ交換工事",
    status: "active",
    startedAt: "2026-05-01",
    endedAt: "2026-06-30",
    overallProgress: 60,
  },
  {
    id: "site-es-2",
    companyCode: "YMD35",
    name: "青葉マンション 外壁補修",
    status: "active",
    startedAt: "2026-04-10",
    endedAt: "2026-07-31",
    overallProgress: 35,
  },
  {
    id: "site-es-3",
    companyCode: "YMD35",
    name: "中央ビル カーテンウォール点検",
    status: "active",
    startedAt: "2026-05-05",
    endedAt: "2026-05-20",
    overallProgress: 80,
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
    phaseId: "phase-s1-2",
    autoProgressSource: "photo_count",
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
    phaseId: "phase-s1-1",
    autoProgressSource: "manual",
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
    phaseId: "phase-s1-3",
    autoProgressSource: "manual",
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
    siteName: "新宿駅西口再開発A棟",
    shift: "day_full",
    // 土日も含め、いつデモしても投稿できる
    days: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    userName: "佐藤さん",
    siteId: "site-1",
    siteName: "新宿駅西口再開発A棟",
    shift: "day_full",
    days: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    userName: "鈴木さん",
    siteId: "site-2",
    siteName: "大手町オフィスタワー改修",
    shift: "night_full",
    days: [0, 1, 2, 4, 5],
  },
  {
    userName: "山田さん",
    siteId: "site-3",
    siteName: "豊洲オフィスレジデンス",
    shift: "day_full",
    days: [1, 2, 3, 4],
  },
];

/** デモ用：同一パターンを複数週に繰り返し（来週ナビでもセルが埋まる） */
const ASSIGNMENT_WEEK_OFFSETS = [-1, 0, 1, 2];

export type AssignmentUpdatePatch = {
  siteId?: string;
  shift?: ShiftType;
  workDate?: string;
  status?: AssignmentStatus;
  /** 現場変更時に assignmentChanges へ記録 */
  reason?: string;
};

const initialAssignments: Assignment[] = [
  ...ASSIGNMENT_WEEK_OFFSETS.flatMap((weekOffset) =>
    seedAssigns.flatMap((seed) =>
      seed.days.map((d) => ({
        id: nextId("as"),
        userName: seed.userName,
        siteId: seed.siteId,
        siteName: seed.siteName,
        workDate: dayOffset(d + weekOffset * 7),
        shift: seed.shift,
        status: "planned" as AssignmentStatus,
      })),
    ),
  ),
  {
    id: nextId("as"),
    userName: "佐藤さん",
    siteId: "site-es-1",
    siteName: "山田邸 サッシ交換工事",
    workDate: new Date().toISOString().slice(0, 10),
    shift: "day_full",
    status: "planned",
  },
];

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

const DEMO_IMAGE = {
  morningBriefing: "/images/morning_briefing.png",
  siteMorning: "/images/site_morning.png",
  scaffoldCheck: "/images/scaffold_check.png",
  wallBoards8: "/images/wall_boards_8.png",
  floorFinish2: "/images/floor_finish_2.png",
  northWall: "/images/north_wall.png",
} as const;

const initialPhotoReports: PhotoReport[] = [
  {
    id: nextId("photo"),
    siteId: "site-1",
    userName: "田中さん",
    category: "progress",
    fileName: "north_wall.png",
    title: "北面 外壁ボード貼り 進捗",
    note: "10枚目まで完了。明日12枚張り終え予定。",
    storagePath: "/photos/新宿駅西口再開発A棟/today/progress/exterior_north.jpg",
    imageUrl: DEMO_IMAGE.northWall,
    createdAt: hoursAgoIso(2),
  },
  {
    id: nextId("photo"),
    siteId: "site-1",
    userName: "田中さん",
    category: "regular",
    fileName: "morning_briefing.png",
    storagePath: "/photos/新宿駅西口再開発A棟/today/regular/morning_briefing.jpg",
    imageUrl: DEMO_IMAGE.morningBriefing,
    createdAt: hoursAgoIso(6),
  },
  {
    id: nextId("photo"),
    siteId: "site-1",
    userName: "佐藤さん",
    category: "progress",
    fileName: "scaffold_check.png",
    title: "足場の固定確認",
    note: "金具の緩みなし。",
    storagePath: "/photos/新宿駅西口再開発A棟/today/progress/scaffold_check.jpg",
    imageUrl: DEMO_IMAGE.scaffoldCheck,
    createdAt: hoursAgoIso(4),
  },
  {
    id: nextId("photo"),
    siteId: "site-2",
    userName: "鈴木さん",
    category: "regular",
    fileName: "site_morning.png",
    storagePath: "/photos/大手町オフィスタワー改修/today/regular/site_morning.jpg",
    imageUrl: DEMO_IMAGE.siteMorning,
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
    storagePath: "/photos/大手町オフィスタワー改修/today/progress/wall_paint.jpg",
    // 未用意のためプレースホルダ。他現場の朝礼写真を仮置きしない
    createdAt: hoursAgoIso(1),
  },
  {
    id: nextId("photo"),
    siteId: "site-3",
    userName: "山田さん",
    category: "regular",
    fileName: "cmansion_morning.jpg",
    storagePath: "/photos/豊洲オフィスレジデンス/today/regular/cmansion_morning.jpg",
    // 未用意のためプレースホルダ
    createdAt: hoursAgoIso(7),
  },
  {
    id: nextId("photo"),
    siteId: "site-3",
    userName: "山田さん",
    category: "progress",
    fileName: "form_setup.jpg",
    title: "型枠調整 6/20箇所",
    storagePath: "/photos/豊洲オフィスレジデンス/today/progress/form_setup.jpg",
    // 未用意のためプレースホルダ
    createdAt: hoursAgoIso(3),
  },
  {
    id: nextId("photo"),
    siteId: "site-1",
    userName: "田中さん",
    category: "progress",
    fileName: "wall_boards_8.png",
    title: "外壁ボード貼り 8枚完了",
    storagePath: "/photos/新宿駅西口再開発A棟/yesterday/progress/yesterday_wall.jpg",
    imageUrl: DEMO_IMAGE.wallBoards8,
    createdAt: daysAgoIso(1, 16),
  },
  {
    id: nextId("photo"),
    siteId: "site-2",
    userName: "鈴木さん",
    category: "progress",
    fileName: "floor_finish_2.png",
    title: "床仕上げ 2区画完了",
    storagePath: "/photos/大手町オフィスタワー改修/yesterday/progress/yesterday_floor.jpg",
    imageUrl: DEMO_IMAGE.floorFinish2,
    createdAt: daysAgoIso(1, 17),
  },
  {
    id: nextId("photo"),
    siteId: "site-es-1",
    userName: "佐藤さん",
    category: "progress",
    fileName: "2026-05-09_山田邸_サッシ取付_施工前_佐藤.jpg",
    title: "施工前（サッシ取付）",
    storagePath:
      "/外壁サッシ/山田邸/サッシ取付/施工前/2026-05-09/2026-05-09_山田邸_サッシ取付_施工前_佐藤.jpg",
    createdAt: hoursAgoIso(6),
    photoSlotId: "before",
    phaseId: "phase-es1-sash",
    phaseLabel: "サッシ取付",
  },
  {
    id: nextId("photo"),
    siteId: "site-es-1",
    userName: "佐藤さん",
    category: "progress",
    fileName: "2026-05-09_山田邸_サッシ取付_寸法確認_佐藤.jpg",
    title: "寸法確認（サッシ取付）",
    storagePath:
      "/外壁サッシ/山田邸/サッシ取付/寸法確認/2026-05-09/2026-05-09_山田邸_サッシ取付_寸法確認_佐藤.jpg",
    createdAt: hoursAgoIso(5),
    photoSlotId: "measure",
    phaseId: "phase-es1-sash",
    phaseLabel: "サッシ取付",
  },
  {
    id: nextId("photo"),
    siteId: "site-es-1",
    userName: "田中さん",
    category: "progress",
    fileName: "2026-05-09_山田邸_サッシ取付_搬入状態_田中.jpg",
    title: "搬入状態（サッシ取付）",
    storagePath:
      "/外壁サッシ/山田邸/サッシ取付/搬入状態/2026-05-09/2026-05-09_山田邸_サッシ取付_搬入状態_田中.jpg",
    createdAt: hoursAgoIso(4),
    photoSlotId: "delivery",
    phaseId: "phase-es1-sash",
    phaseLabel: "サッシ取付",
  },
  {
    id: nextId("photo"),
    siteId: "site-es-2",
    userName: "鈴木さん",
    category: "progress",
    fileName: "2026-05-08_青葉マンション_外壁補修_施工前_鈴木.jpg",
    title: "施工前（外壁補修）",
    storagePath:
      "/外壁サッシ/青葉マンション/外壁補修/施工前/2026-05-08/2026-05-08_青葉マンション_外壁補修_施工前_鈴木.jpg",
    createdAt: hoursAgoIso(20),
    photoSlotId: "before",
    phaseId: "phase-es2-wall",
    phaseLabel: "外壁補修",
  },
  {
    id: nextId("photo"),
    siteId: "site-es-3",
    userName: "田中さん",
    category: "progress",
    fileName: "2026-05-09_中央ビル_CW確認_施工前全景_田中.jpg",
    title: "施工前全景（カーテンウォール確認）",
    storagePath:
      "/外壁サッシ/中央ビル/カーテンウォール確認/施工前全景/2026-05-09/2026-05-09_中央ビル_CW確認_施工前全景_田中.jpg",
    createdAt: hoursAgoIso(8),
    photoSlotId: "before",
    phaseId: "phase-es3-cw",
    phaseLabel: "カーテンウォール確認",
  },
  {
    id: nextId("photo"),
    siteId: "site-es-3",
    userName: "田中さん",
    category: "progress",
    fileName: "2026-05-09_中央ビル_CW確認_アンカー確認_田中.jpg",
    title: "アンカー確認（カーテンウォール確認）",
    storagePath:
      "/外壁サッシ/中央ビル/カーテンウォール確認/アンカー確認/2026-05-09/2026-05-09_中央ビル_CW確認_アンカー確認_田中.jpg",
    createdAt: hoursAgoIso(7),
    photoSlotId: "anchor",
    phaseId: "phase-es3-cw",
    phaseLabel: "カーテンウォール確認",
  },
  {
    id: nextId("photo"),
    siteId: "site-es-3",
    userName: "田中さん",
    category: "progress",
    fileName: "2026-05-09_中央ビル_CW確認_ガラス面_田中.jpg",
    title: "ガラス面（カーテンウォール確認）",
    storagePath:
      "/外壁サッシ/中央ビル/カーテンウォール確認/ガラス面/2026-05-09/2026-05-09_中央ビル_CW確認_ガラス面_田中.jpg",
    createdAt: hoursAgoIso(6),
    photoSlotId: "glass",
    phaseId: "phase-es3-cw",
    phaseLabel: "カーテンウォール確認",
  },
  {
    id: nextId("photo"),
    siteId: "site-es-3",
    userName: "田中さん",
    category: "progress",
    fileName: "2026-05-09_中央ビル_CW確認_シーリング_田中.jpg",
    title: "シーリング（カーテンウォール確認）",
    storagePath:
      "/外壁サッシ/中央ビル/カーテンウォール確認/シーリング/2026-05-09/2026-05-09_中央ビル_CW確認_シーリング_田中.jpg",
    createdAt: hoursAgoIso(5),
    photoSlotId: "seal",
    phaseId: "phase-es3-cw",
    phaseLabel: "カーテンウォール確認",
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

export type DemoNotification = {
  id: string;
  userName: string;
  title: string;
  body: string;
  createdAt: string;
  audience?: "admin" | "user";
  companyCode?: string;
  href?: string;
  reportId?: string;
  photoId?: string;
};

const initialNotifications: DemoNotification[] = [
  {
    id: nextId("ntf"),
    userName: "鈴木さん",
    title: "雨で作業中断",
    body: "大手町オフィスタワー改修・足場点検が雨のため中断しました",
    createdAt: hoursAgoIso(3),
    audience: "admin",
    companyCode: "YMD35",
    href: "/admin/field-reports",
  },
  {
    id: nextId("ntf"),
    userName: "田中さん",
    title: "進捗報告が届きました",
    body: "新宿駅西口再開発A棟：外壁ボード貼り 10枚完了",
    createdAt: hoursAgoIso(2),
    audience: "admin",
    companyCode: "YMD35",
    href: "/admin/field-reports",
  },
  {
    id: nextId("ntf"),
    userName: "山田さん",
    title: "作業開始",
    body: "豊洲オフィスレジデンス 型枠調整に着手",
    createdAt: hoursAgoIso(7),
    audience: "admin",
    companyCode: "YMD35",
    href: "/admin/field-reports",
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
  phases: initialPhases,
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

export function getCompanyCodeForSite(siteId: string): string {
  return state.sites.find((s) => s.id === siteId)?.companyCode ?? "YMD35";
}

export function getNotificationsForAdmin(companyCode: string): DemoNotification[] {
  return state.notifications.filter(
    (n) =>
      (n.audience === "admin" || !n.audience) &&
      (n.companyCode ?? "YMD35") === companyCode,
  );
}

export function getReportById(id: string): Report | undefined {
  return state.reports.find((r) => r.id === id);
}

export function getPhotoById(id: string): PhotoReport | undefined {
  return state.photoReports.find((p) => p.id === id);
}

export function getRelatedPhotosForReport(report: Report, limit = 8): PhotoReport[] {
  const reportTime = new Date(report.createdAt).getTime();
  const windowMs = 48 * 60 * 60 * 1000;
  return state.photoReports
    .filter((p) => {
      if (p.siteId !== report.siteId) return false;
      const t = new Date(p.createdAt).getTime();
      return Math.abs(t - reportTime) <= windowMs;
    })
    .slice(0, limit);
}

export function upsertReport(report: Report) {
  const idx = state.reports.findIndex((r) => r.id === report.id);
  if (idx >= 0) state.reports[idx] = report;
  else state.reports.unshift(report);
}

export function upsertPhoto(photo: PhotoReport) {
  const idx = state.photoReports.findIndex((p) => p.id === photo.id);
  if (idx >= 0) state.photoReports[idx] = photo;
  else state.photoReports.unshift(photo);
}

export function upsertNotification(notification: DemoNotification) {
  const idx = state.notifications.findIndex((n) => n.id === notification.id);
  if (idx >= 0) state.notifications[idx] = notification;
  else state.notifications.unshift(notification);
}

export function createReport(
  siteId: string,
  authorName: string,
  rawText: string,
  companyCode?: string,
) {
  const company = companyCode ?? getCompanyCodeForSite(siteId);
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
  const siteName = state.sites.find((s) => s.id === siteId)?.name ?? siteId;
  state.notifications.unshift({
    id: nextId("ntf"),
    userName: authorName,
    title: "日報が届きました",
    body: `${authorName}さん（${siteName}）から日報が届きました`,
    createdAt: todayIso(),
    audience: "admin",
    companyCode: company,
    href: `/admin/reports/${report.id}`,
    reportId: report.id,
  });
  return report;
}

function refreshPhasesForSite(siteId: string) {
  for (const phase of state.phases.filter((p) => p.siteId === siteId)) {
    if (phase.progressMode === "manual") continue;
    const tasks = state.tasks.filter((t) => t.phaseId === phase.id);
    if (tasks.length === 0) continue;
    const pct = Math.round(
      tasks.reduce((sum, t) => sum + t.progressPct, 0) / tasks.length,
    );
    phase.progressPct = pct;
  }
  const site = state.sites.find((s) => s.id === siteId);
  const phasesHere = state.phases.filter((p) => p.siteId === siteId);
  if (site && phasesHere.length > 0) {
    site.overallProgress = Math.round(
      phasesHere.reduce((sum, p) => sum + p.progressPct, 0) / phasesHere.length,
    );
  }
}

function applyPhotoProgressFromReport(photo: PhotoReport, userName: string) {
  if (photo.category !== "progress") return;
  const candidates = state.tasks.filter(
    (t) =>
      t.siteId === photo.siteId &&
      t.autoProgressSource === "photo_count" &&
      t.status !== "completed",
  );
  if (candidates.length === 0) return;
  const byTitle = candidates.find(
    (t) => photo.title && photo.title.includes(t.title),
  );
  const task = byTitle ?? candidates[0];
  addTaskQuantity(task.id, 1, userName);
  refreshPhasesForSite(photo.siteId);
}

export function togglePhaseProgressMode(phaseId: string): ProjectPhase | null {
  const phase = state.phases.find((p) => p.id === phaseId);
  if (!phase) return null;
  phase.progressMode = phase.progressMode === "auto" ? "manual" : "auto";
  return phase;
}

export function setPhaseManualPercent(phaseId: string, pct: number): ProjectPhase | null {
  const phase = state.phases.find((p) => p.id === phaseId);
  if (!phase) return null;
  phase.progressMode = "manual";
  phase.progressPct = Math.max(0, Math.min(100, pct));
  const site = state.sites.find((s) => s.id === phase.siteId);
  const phasesHere = state.phases.filter((p) => p.siteId === phase.siteId);
  if (site && phasesHere.length > 0) {
    site.overallProgress = Math.round(
      phasesHere.reduce((sum, p) => sum + p.progressPct, 0) / phasesHere.length,
    );
  }
  return phase;
}

export function createPhotoReport(input: {
  siteId: string;
  userName: string;
  category: PhotoCategory;
  fileName: string;
  title?: string;
  note?: string;
  imageUrl?: string;
  photoSlotId?: string;
  phaseId?: string;
  phaseLabel?: string;
}) {
  const site = state.sites.find((item) => item.id === input.siteId);
  const date = new Date().toISOString().slice(0, 10);
  const siteFolder = site?.name ?? input.siteId;
  const sash = getExteriorSashConfig(input.siteId);

  let fileName = input.fileName.trim();
  let title = input.title?.trim();
  let storagePath: string;
  let photoSlotId = input.photoSlotId;
  let phaseId = input.phaseId;
  let phaseLabel = input.phaseLabel;

  if (photoSlotId && sash) {
    const slot = sash.slots.find((s) => s.id === photoSlotId);
    const phLabel = phaseLabel ?? sash.currentPhase.label;
    const phId = phaseId ?? sash.currentPhase.id;
    if (slot) {
      title = title || `${slot.label}（${phLabel}）`;
      fileName = buildAutoFileName({
        date,
        siteShort: sash.shortName,
        phaseLabel: phLabel,
        slotLabel: slot.label,
        userName: input.userName,
      });
      storagePath = buildDemoStoragePath({
        siteShort: sash.shortName,
        phaseLabel: phLabel,
        slotLabel: slot.label,
        date,
        fileName,
      });
      phaseId = phId;
      phaseLabel = phLabel;
    } else {
      storagePath = `/photos/${siteFolder}/${date}/${input.category}/${fileName}`;
    }
  } else {
    storagePath = `/photos/${siteFolder}/${date}/${input.category}/${fileName}`;
  }

  const report: PhotoReport = {
    id: nextId("photo"),
    siteId: input.siteId,
    userName: input.userName,
    category: input.category,
    fileName,
    title,
    note: input.note?.trim(),
    storagePath,
    imageUrl: input.imageUrl?.trim() || undefined,
    createdAt: todayIso(),
    photoSlotId,
    phaseId,
    phaseLabel,
  };
  state.photoReports.unshift(report);
  applyPhotoProgressFromReport(report, input.userName);
  const company = site?.companyCode ?? "YMD35";
  const label = title || fileName;
  state.notifications.unshift({
    id: nextId("ntf"),
    userName: input.userName,
    title: input.category === "progress" ? "進捗写真が届きました" : "定例写真が届きました",
    body: `${input.userName}さん（${site?.name ?? input.siteId}）：${label}`,
    createdAt: todayIso(),
    audience: "admin",
    companyCode: company,
    href: `/admin/reports/photos/${report.id}`,
    photoId: report.id,
  });
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

export function updateAssignment(
  assignmentId: string,
  patch: AssignmentUpdatePatch,
): { assignment: Assignment; siteChange: AssignmentChange | null } | null {
  const assignment = state.assignments.find((item) => item.id === assignmentId);
  if (!assignment) return null;

  const beforeSiteName = assignment.siteName;
  let siteChanged = false;

  if (patch.siteId !== undefined) {
    const site = state.sites.find((s) => s.id === patch.siteId);
    if (!site) return null;
    if (assignment.siteId !== site.id || assignment.siteName !== site.name) {
      siteChanged = true;
    }
    assignment.siteId = site.id;
    assignment.siteName = site.name;
  }

  if (patch.shift !== undefined) {
    assignment.shift = patch.shift;
  }
  if (patch.workDate !== undefined) {
    assignment.workDate = patch.workDate;
  }
  if (patch.status !== undefined) {
    assignment.status = patch.status;
  } else if (
    patch.siteId !== undefined ||
    patch.shift !== undefined ||
    patch.workDate !== undefined
  ) {
    if (assignment.status !== "cancelled") {
      assignment.status = "changed";
    }
  }

  let siteChange: AssignmentChange | null = null;
  if (siteChanged) {
    siteChange = {
      id: nextId("chg"),
      assignmentId,
      reason: patch.reason ?? "配員変更",
      beforeSiteName,
      afterSiteName: assignment.siteName,
      acknowledgedBy: [],
      changedAt: todayIso(),
    };
    state.assignmentChanges.unshift(siteChange);
  }

  return { assignment, siteChange };
}

export function applyAssignmentChange(assignmentId: string, afterSiteName: string, reason: string) {
  const site = state.sites.find((s) => s.name === afterSiteName.trim());
  if (!site) return null;
  const result = updateAssignment(assignmentId, { siteId: site.id, reason });
  return result?.siteChange ?? null;
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
