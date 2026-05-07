"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { ADMIN_COLORS } from "@/lib/admin-theme";

export interface BarSeries {
  key: string;
  label: string;
  color?: string;
}

interface BarChartCardProps {
  data: Array<Record<string, string | number>>;
  series: BarSeries[];
  xKey: string;
  height?: number;
  yUnit?: string;
  layout?: "vertical" | "horizontal";
  showValues?: boolean;
  perBarColors?: string[];
}

export function BarChartCard({
  data,
  series,
  xKey,
  height = 240,
  yUnit,
  layout = "horizontal",
  showValues = false,
  perBarColors,
}: BarChartCardProps) {
  const isVerticalBars = layout === "vertical";
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={isVerticalBars ? "vertical" : "horizontal"}
          margin={{ top: 8, right: 12, bottom: 4, left: -8 }}
        >
          <CartesianGrid stroke={ADMIN_COLORS.chart.grid} strokeDasharray="3 3" />
          {isVerticalBars ? (
            <>
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: ADMIN_COLORS.chart.axis }}
                tickLine={false}
                axisLine={{ stroke: ADMIN_COLORS.chart.grid }}
                tickFormatter={(v: number) => (yUnit ? `${v}${yUnit}` : `${v}`)}
              />
              <YAxis
                type="category"
                dataKey={xKey}
                tick={{ fontSize: 11, fill: ADMIN_COLORS.chart.axis }}
                tickLine={false}
                axisLine={{ stroke: ADMIN_COLORS.chart.grid }}
                width={88}
              />
            </>
          ) : (
            <>
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
            </>
          )}
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
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={
                s.color ?? ADMIN_COLORS.chart.series[idx % ADMIN_COLORS.chart.series.length]
              }
              radius={[4, 4, 4, 4]}
              isAnimationActive={false}
            >
              {perBarColors
                ? data.map((_, i) => (
                    <Cell key={`bar-${i}`} fill={perBarColors[i % perBarColors.length]} />
                  ))
                : null}
              {showValues ? (
                <LabelList
                  dataKey={s.key}
                  position={isVerticalBars ? "right" : "top"}
                  style={{ fontSize: 11, fill: ADMIN_COLORS.chart.axis }}
                  formatter={(v) => (yUnit ? `${v}${yUnit}` : `${v}`)}
                />
              ) : null}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
