import { ADMIN_COLORS } from "@/lib/admin-theme";

export interface GanttRow {
  id: string;
  label: string;
  startOffsetPercent: number;
  widthPercent: number;
  progressPercent?: number;
  status?: "not_started" | "in_progress" | "paused" | "completed";
  color?: string;
  meta?: string;
}

interface GanttBarProps {
  rows: GanttRow[];
  columns: string[];
  todayPercent?: number;
  emptyText?: string;
}

const STATUS_COLOR: Record<NonNullable<GanttRow["status"]>, string> = {
  not_started: ADMIN_COLORS.status.notStarted,
  in_progress: ADMIN_COLORS.status.inProgress,
  paused: ADMIN_COLORS.status.paused,
  completed: ADMIN_COLORS.status.completed,
};

export function GanttBar({
  rows,
  columns,
  todayPercent,
  emptyText = "工程がありません",
}: GanttBarProps) {
  if (!rows.length) {
    return (
      <p className="rounded-lg bg-zinc-50 py-8 text-center text-sm text-zinc-500">
        {emptyText}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div
          className="grid items-end gap-1 border-b border-zinc-200 pb-2 text-xs text-zinc-500"
          style={{
            gridTemplateColumns: `180px repeat(${columns.length}, minmax(0, 1fr))`,
          }}
        >
          <span className="text-zinc-700">工程</span>
          {columns.map((col) => (
            <span key={col} className="text-center">
              {col}
            </span>
          ))}
        </div>
        <ul className="divide-y divide-zinc-100">
          {rows.map((row) => {
            const fillColor =
              row.color ?? (row.status ? STATUS_COLOR[row.status] : ADMIN_COLORS.primary);
            return (
              <li
                key={row.id}
                className="grid items-center gap-1 py-2 text-sm"
                style={{
                  gridTemplateColumns: `180px repeat(${columns.length}, minmax(0, 1fr))`,
                }}
              >
                <div className="pr-2">
                  <p className="truncate font-semibold text-zinc-900">{row.label}</p>
                  {row.meta ? (
                    <p className="truncate text-xs text-zinc-500">{row.meta}</p>
                  ) : null}
                </div>
                <div
                  className="relative col-span-full h-7 rounded bg-zinc-50"
                  style={{ gridColumn: `2 / span ${columns.length}` }}
                >
                  {todayPercent != null ? (
                    <div
                      className="absolute top-0 bottom-0 w-px bg-red-400"
                      style={{ left: `${todayPercent}%` }}
                      aria-hidden
                    />
                  ) : null}
                  <div
                    className="absolute top-1 bottom-1 rounded"
                    style={{
                      left: `${row.startOffsetPercent}%`,
                      width: `${row.widthPercent}%`,
                      backgroundColor: `${fillColor}40`,
                      border: `1px solid ${fillColor}`,
                    }}
                  />
                  {row.progressPercent != null ? (
                    <div
                      className="absolute top-1 bottom-1 rounded"
                      style={{
                        left: `${row.startOffsetPercent}%`,
                        width: `${(row.widthPercent * row.progressPercent) / 100}%`,
                        backgroundColor: fillColor,
                      }}
                    />
                  ) : null}
                  {row.progressPercent != null ? (
                    <span
                      className="absolute top-1/2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow"
                      style={{
                        left: `calc(${row.startOffsetPercent}% + 4px)`,
                      }}
                    >
                      {row.progressPercent}%
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        {todayPercent != null ? (
          <p className="mt-2 text-xs text-zinc-500">
            <span className="mr-1 inline-block h-2 w-px bg-red-400 align-middle" />
            赤線＝本日
          </p>
        ) : null}
      </div>
    </div>
  );
}
