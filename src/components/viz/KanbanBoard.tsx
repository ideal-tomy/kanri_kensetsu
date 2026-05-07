import type { ReactNode } from "react";

export interface KanbanColumnDef<T> {
  id: string;
  label: string;
  description?: string;
  accent?: string;
  items: T[];
}

interface KanbanBoardProps<T> {
  columns: KanbanColumnDef<T>[];
  renderItem: (item: T) => ReactNode;
  emptyText?: string;
}

export function KanbanBoard<T extends { id: string }>({
  columns,
  renderItem,
  emptyText = "アイテムがありません",
}: KanbanBoardProps<T>) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((col) => (
        <section
          key={col.id}
          className="flex flex-col rounded-xl border border-zinc-200 bg-white"
        >
          <header className="flex items-center justify-between border-b border-zinc-100 px-3 py-2">
            <div className="flex items-center gap-2">
              {col.accent ? (
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: col.accent }}
                />
              ) : null}
              <h3 className="text-sm font-bold text-zinc-900">{col.label}</h3>
            </div>
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
              {col.items.length}
            </span>
          </header>
          {col.description ? (
            <p className="px-3 pt-2 text-[11px] text-zinc-500">{col.description}</p>
          ) : null}
          <div className="space-y-2 p-3">
            {col.items.length === 0 ? (
              <p className="rounded-md bg-zinc-50 px-3 py-4 text-center text-xs text-zinc-500">
                {emptyText}
              </p>
            ) : (
              col.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-zinc-200 bg-white p-2 shadow-sm"
                >
                  {renderItem(item)}
                </div>
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
