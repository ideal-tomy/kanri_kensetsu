"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { ADMIN_COLORS } from "@/lib/admin-theme";

export interface LineSeries {
  key: string;
  label: string;
  color?: string;
}

interface LineChartCardProps {
  data: Array<Record<string, string | number>>;
  series: LineSeries[];
  xKey: string;
  height?: number;
  yUnit?: string;
}

export function LineChartCard({
  data,
  series,
  xKey,
  height = 240,
  yUnit,
}: LineChartCardProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
          <CartesianGrid stroke={ADMIN_COLORS.chart.grid} strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: ADMIN_COLORS.chart.axis }}
            tickLine={false}
            axisLine={{ stroke: ADMIN_COLORS.chart.grid }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: ADMIN_COLORS.chart.axis }}
            tickLine={false}
            axisLine={{ stroke: ADMIN_COLORS.chart.grid }}
            width={36}
            tickFormatter={(v: number) => (yUnit ? `${v}${yUnit}` : `${v}`)}
          />
          <Tooltip
            contentStyle={{
              border: `1px solid ${ADMIN_COLORS.chart.tooltipBorder}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ fontWeight: 600 }}
            formatter={(value, name) => {
              const v =
                typeof value === "number" ? (yUnit ? `${value}${yUnit}` : value) : String(value ?? "");
              return [v, String(name ?? "")];
            }}
          />
          {series.length > 1 ? (
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              iconType="circle"
              align="right"
              verticalAlign="top"
            />
          ) : null}
          {series.map((s, idx) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={
                s.color ?? ADMIN_COLORS.chart.series[idx % ADMIN_COLORS.chart.series.length]
              }
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
