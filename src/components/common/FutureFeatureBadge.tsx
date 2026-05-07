import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface FutureFeatureBadgeProps {
  children: ReactNode;
  label?: string;
  description?: string;
}

export function FutureFeatureBadge({
  children,
  label = "将来実装予定",
  description,
}: FutureFeatureBadgeProps) {
  return (
    <div className="relative">
      <div className="absolute -top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white shadow-md">
        <Sparkles className="h-3 w-3" aria-hidden />
        {label}
      </div>
      <div className="rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/40 p-1">
        {description ? (
          <p className="px-3 pt-2 text-[11px] font-medium text-purple-700">
            {description}
          </p>
        ) : null}
        <div className="rounded-lg bg-white">{children}</div>
      </div>
    </div>
  );
}
