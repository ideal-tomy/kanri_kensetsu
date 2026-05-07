import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Bell,
  Camera,
  ClipboardCheck,
  FileText,
  MessageSquare,
} from "lucide-react";

export type TimelineSeverity = "info" | "warning" | "danger" | "success";

export interface TimelineItem {
  id: string;
  title: string;
  body?: string;
  meta?: string;
  timestamp: string;
  type?: "photo" | "report" | "task" | "notification" | "alert" | "chat" | "custom";
  severity?: TimelineSeverity;
  icon?: LucideIcon;
}

interface TimelineListProps {
  items: TimelineItem[];
  emptyText?: string;
  showRelative?: boolean;
}

const TYPE_ICON: Record<NonNullable<TimelineItem["type"]>, LucideIcon> = {
  photo: Camera,
  report: FileText,
  task: ClipboardCheck,
  notification: Bell,
  alert: AlertTriangle,
  chat: MessageSquare,
  custom: Bell,
};

const SEVERITY_BG: Record<TimelineSeverity, string> = {
  info: "bg-blue-100 text-blue-700",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
  success: "bg-emerald-100 text-emerald-700",
};

export function TimelineList({
  items,
  emptyText = "まだ動きがありません",
  showRelative = true,
}: TimelineListProps) {
  if (!items.length) {
    return (
      <div className="rounded-xl bg-zinc-50 py-8 text-center text-sm text-zinc-500">
        {emptyText}
      </div>
    );
  }
  return (
    <ol className="space-y-3">
      {items.map((item) => {
        const Icon = item.icon ?? (item.type ? TYPE_ICON[item.type] : Bell);
        const severity = item.severity ?? "info";
        return (
          <li key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${SEVERITY_BG[severity]}`}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <span className="mt-1 w-px flex-1 bg-zinc-200" />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-bold text-zinc-900">{item.title}</p>
                <p className="text-xs text-zinc-500">
                  {showRelative ? formatRelative(item.timestamp) : item.timestamp}
                </p>
              </div>
              {item.body ? (
                <p className="mt-1 text-sm text-zinc-700">{item.body}</p>
              ) : null}
              {item.meta ? (
                <p className="mt-1 text-xs text-zinc-500">{item.meta}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function formatRelative(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  return date.toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
