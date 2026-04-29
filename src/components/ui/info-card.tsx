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
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-orange-50 text-orange-600">
          <Icon className="h-4 w-4" />
        </div>
        {badge ? (
          <span className="rounded bg-orange-100 px-2 py-0.5 text-xs text-orange-700">
            {badge}
          </span>
        ) : null}
      </div>
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 text-sm text-zinc-600">{description}</p>
      <p className="mt-3 text-sm font-medium text-orange-700">詳細へ</p>
    </Link>
  );
}
