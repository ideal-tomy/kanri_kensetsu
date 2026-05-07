import { ADMIN_COLORS } from "@/lib/admin-theme";

export interface BarListItem {
  name: string;
  value: number;
  meta?: string;
  href?: string;
}

interface BarListProps {
  data: BarListItem[];
  unit?: string;
  color?: string;
  emptyText?: string;
}

export function BarList({
  data,
  unit = "件",
  color = ADMIN_COLORS.primary,
  emptyText = "データがありません",
}: BarListProps) {
  if (!data.length) {
    return <p className="py-8 text-center text-sm text-zinc-500">{emptyText}</p>;
  }
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <ol className="space-y-2">
      {data.map((item, idx) => {
        const ratio = (item.value / max) * 100;
        return (
          <li key={`${item.name}-${idx}`} className="space-y-1">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="truncate font-medium text-zinc-900">{item.name}</span>
              <span className="shrink-0 text-zinc-700">
                <span className="font-bold text-zinc-900">{item.value}</span>
                <span className="ml-0.5 text-xs text-zinc-500">{unit}</span>
                {item.meta ? (
                  <span className="ml-2 text-xs text-zinc-500">{item.meta}</span>
                ) : null}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${ratio}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
