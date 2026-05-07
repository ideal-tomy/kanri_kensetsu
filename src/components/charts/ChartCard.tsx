import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <section
      className={`rounded-xl border border-zinc-200 bg-white p-4 shadow-sm ${className}`}
    >
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-zinc-900">{title}</h2>
          {subtitle ? (
            <p className="text-xs text-zinc-500">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
