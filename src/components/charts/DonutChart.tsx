"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ADMIN_COLORS } from "@/lib/admin-theme";

export interface DonutSlice {
  name: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  height?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({
  data,
  height = 220,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={2}
            isAnimationActive={false}
          >
            {data.map((slice, idx) => (
              <Cell
                key={slice.name}
                fill={
                  slice.color ??
                  ADMIN_COLORS.chart.series[idx % ADMIN_COLORS.chart.series.length]
                }
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              border: `1px solid ${ADMIN_COLORS.chart.tooltipBorder}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value, name) => {
              const num = typeof value === "number" ? value : 0;
              const pct = total ? Math.round((num / total) * 100) : 0;
              return [`${num}件 (${pct}%)`, String(name ?? "")];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {centerLabel || centerValue ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue ? (
            <p className="text-2xl font-bold text-zinc-900">{centerValue}</p>
          ) : null}
          {centerLabel ? (
            <p className="text-xs text-zinc-500">{centerLabel}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
