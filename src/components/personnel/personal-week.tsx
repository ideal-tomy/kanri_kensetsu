"use client";

import { useMemo, useState } from "react";
import { COPY, SHIFT_LABEL } from "@/lib/copy";

type Shift =
  | "day_full"
  | "day_am"
  | "day_pm"
  | "night_full"
  | "night_early"
  | "night_late";

type Assignment = {
  id: string;
  userName: string;
  siteId: string;
  siteName: string;
  workDate: string;
  shift: Shift;
  status: "planned" | "confirmed" | "changed" | "cancelled";
};

const formatYmd = (d: Date) => d.toISOString().slice(0, 10);

const getMonday = (offsetWeeks: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + offsetWeeks * 7);
  return monday;
};

const WEEK_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

export function PersonalWeek({
  assignments,
  todayStr,
}: {
  assignments: Assignment[];
  todayStr: string;
}) {
  const names = useMemo(() => {
    const set = new Set(assignments.map((a) => a.userName));
    return Array.from(set);
  }, [assignments]);

  const [target, setTarget] = useState<string>(names[0] ?? "");

  const monday = getMonday(0);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      ymd: formatYmd(d),
      label: WEEK_LABELS[i],
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      isToday: formatYmd(d) === todayStr,
    };
  });

  const mine = assignments.filter((a) => a.userName === target);

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{COPY.assignment.personal_view}</h2>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="min-h-11 rounded-lg border border-zinc-300 px-3 text-sm font-semibold"
        >
          {names.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <ul className="mt-3 space-y-2">
        {days.map((d) => {
          const items = mine.filter((m) => m.workDate === d.ymd);
          return (
            <li
              key={d.ymd}
              className={`rounded-lg border p-3 ${
                d.isToday
                  ? "border-orange-400 bg-orange-50"
                  : "border-zinc-200 bg-zinc-50"
              }`}
            >
              <p className="text-sm font-semibold text-zinc-700">
                {d.label} {d.date}
                {d.isToday ? <span className="ml-2 text-xs font-semibold text-orange-700">本日</span> : null}
              </p>
              {items.length === 0 ? (
                <p className="text-sm text-zinc-500">・ 休み（または未配置）</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {items.map((m) => (
                    <li key={m.id} className="text-sm font-semibold text-zinc-900">
                      {m.shift.startsWith("night") ? "🌙" : "☀"} {m.siteName}
                      <span className="ml-2 text-xs text-zinc-600">
                        {SHIFT_LABEL[m.shift]}
                      </span>
                      {m.status === "changed" ? (
                        <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                          変更あり
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
