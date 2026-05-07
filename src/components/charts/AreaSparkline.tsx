"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ADMIN_COLORS } from "@/lib/admin-theme";

interface SparkPoint {
  value: number;
}

interface AreaSparklineProps {
  data: SparkPoint[];
  color?: string;
  height?: number;
}

export function AreaSparkline({
  data,
  color = ADMIN_COLORS.primary,
  height = 36,
}: AreaSparklineProps) {
  if (!data.length) {
    return <div style={{ height }} />;
  }
  const gradientId = `spark-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
