import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface InfoCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export function InfoCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
}: InfoCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm outline-none ring-zinc-300 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-muted text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </div>
        {badge ? (
          <span className="rounded bg-primary-muted px-2 py-0.5 text-xs font-medium text-primary">
            {badge}
          </span>
        ) : null}
      </div>
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 text-sm text-zinc-600">{description}</p>
      <p className="mt-3 text-sm font-medium text-primary group-hover:underline">
        詳細へ
      </p>
    </Link>
  );
}
