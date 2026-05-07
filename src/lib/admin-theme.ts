export const ADMIN_COLORS = {
  primary: "#ea580c",
  primaryMuted: "#fff7ed",
  primaryHover: "#c2410c",
  status: {
    notStarted: "#a1a1aa",
    inProgress: "#3b82f6",
    paused: "#f59e0b",
    completed: "#16a34a",
    delayed: "#dc2626",
  },
  category: {
    regular: "#3b82f6",
    progress: "#ea580c",
  },
  severity: {
    info: "#3b82f6",
    warning: "#f59e0b",
    danger: "#dc2626",
    success: "#16a34a",
  },
  chart: {
    series: ["#ea580c", "#3b82f6", "#16a34a", "#a855f7", "#f59e0b", "#0ea5e9"],
    grid: "#e4e4e7",
    axis: "#71717a",
    tooltipBg: "#ffffff",
    tooltipBorder: "#e4e4e7",
  },
} as const;

export const STATUS_LABEL = {
  not_started: "未着手",
  in_progress: "進行中",
  paused: "中断",
  completed: "完了",
} as const;

export const STATUS_BG = {
  not_started: "bg-zinc-100 text-zinc-700",
  in_progress: "bg-blue-100 text-blue-700",
  paused: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-700",
} as const;

export const STATUS_DOT = {
  not_started: "bg-zinc-400",
  in_progress: "bg-blue-500",
  paused: "bg-amber-500",
  completed: "bg-emerald-500",
} as const;

export const CATEGORY_LABEL = {
  regular: "定例報告",
  progress: "進捗報告",
} as const;

export const CATEGORY_BG = {
  regular: "bg-blue-500 text-white",
  progress: "bg-orange-500 text-white",
} as const;

export const CATEGORY_TEXT = {
  regular: "text-blue-700",
  progress: "text-orange-700",
} as const;

export type AdminColorKey = keyof typeof ADMIN_COLORS;
