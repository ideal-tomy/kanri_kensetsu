import { ADMIN_COLORS } from "@/lib/admin-theme";

interface ProgressRingProps {
  value: number;
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  showValue?: boolean;
}

export function ProgressRing({
  value,
  size = 96,
  thickness = 10,
  color = ADMIN_COLORS.primary,
  trackColor = "#f4f4f5",
  label,
  showValue = true,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={thickness}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue ? (
          <p className="text-lg font-bold leading-tight text-zinc-900">
            {clamped}
            <span className="text-xs text-zinc-500">%</span>
          </p>
        ) : null}
        {label ? (
          <p className="text-[10px] font-medium text-zinc-500">{label}</p>
        ) : null}
      </div>
    </div>
  );
}
