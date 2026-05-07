import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { AreaSparkline } from "@/components/charts/AreaSparkline";
import { ADMIN_COLORS } from "@/lib/admin-theme";

interface SparkPoint {
  value: number;
}

export interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  hint?: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  trend?: {
    value: number;
    label?: string;
  };
  spark?: SparkPoint[];
  sparkColor?: string;
  highlight?: "default" | "danger" | "warning" | "success";
}

const HIGHLIGHT_BG = {
  default: "bg-white",
  danger: "bg-red-50",
  warning: "bg-amber-50",
  success: "bg-emerald-50",
} as const;

const HIGHLIGHT_BORDER = {
  default: "border-zinc-200",
  danger: "border-red-200",
  warning: "border-amber-200",
  success: "border-emerald-200",
} as const;

export function StatCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  iconBg = "bg-primary-muted",
  iconColor = "text-primary",
  trend,
  spark,
  sparkColor,
  highlight = "default",
}: StatCardProps) {
  const trendIcon =
    trend && trend.value > 0 ? (
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
    ) : trend && trend.value < 0 ? (
      <ArrowDownRight className="h-3.5 w-3.5" aria-hidden />
    ) : (
      <Minus className="h-3.5 w-3.5" aria-hidden />
    );
  const trendColor =
    !trend || trend.value === 0
      ? "text-zinc-500"
      : trend.value > 0
        ? "text-emerald-600"
        : "text-red-600";

  return (
    <div
      className={`flex flex-col rounded-xl border p-4 shadow-sm ${HIGHLIGHT_BG[highlight]} ${HIGHLIGHT_BORDER[highlight]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-zinc-600">{label}</p>
        {Icon ? (
          <div
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${iconBg} ${iconColor}`}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </div>
        ) : null}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <p className="text-3xl font-bold text-zinc-900">{value}</p>
        {unit ? <span className="text-sm text-zinc-500">{unit}</span> : null}
      </div>
      {trend ? (
        <p className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          {trendIcon}
          <span>
            {trend.value > 0 ? "+" : ""}
            {trend.value}
            {trend.label ? ` ${trend.label}` : ""}
          </span>
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-zinc-500">{hint}</p>
      ) : null}
      {spark && spark.length > 1 ? (
        <div className="mt-3">
          <AreaSparkline
            data={spark}
            color={sparkColor ?? ADMIN_COLORS.primary}
            height={40}
          />
        </div>
      ) : null}
    </div>
  );
}
