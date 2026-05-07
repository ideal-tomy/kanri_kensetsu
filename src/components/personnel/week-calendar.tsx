"use client";

import { useMemo, useState } from "react";
import { COPY, SHIFT_LABEL_SHORT } from "@/lib/copy";

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

type Site = { id: string; name: string };

const isNight = (s: Shift) => s.startsWith("night");
const isHalf = (s: Shift) => s.endsWith("am") || s.endsWith("pm") || s === "night_early" || s === "night_late";

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

export function WeekCalendar({
  sites,
  assignments,
  todayStr,
}: {
  sites: Site[];
  assignments: Assignment[];
  todayStr: string;
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const monday = useMemo(() => getMonday(weekOffset), [weekOffset]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        ymd: formatYmd(d),
        label: WEEK_LABELS[i],
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        isToday: formatYmd(d) === todayStr,
      };
    });
  }, [monday, todayStr]);

  const cellAssignments = (siteId: string, ymd: string) =>
    assignments.filter((a) => a.siteId === siteId && a.workDate === ymd);

  const headerLabel = `${monday.getMonth() + 1}/${monday.getDate()} 〜 ${days[6].date}`;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold">{COPY.assignment.week_view}</h2>
          <p className="text-sm text-zinc-600">{headerLabel}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w - 1)}
            className="min-h-11 rounded-lg bg-zinc-200 px-3 font-semibold"
          >
            先週
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset(0)}
            className="min-h-11 rounded-lg bg-zinc-900 px-3 font-semibold text-white"
          >
            今週
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w + 1)}
            className="min-h-11 rounded-lg bg-zinc-200 px-3 font-semibold"
          >
            来週
          </button>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-zinc-200 px-2 py-2 text-left">現場</th>
              {days.map((d) => (
                <th
                  key={d.ymd}
                  className={`border-b border-zinc-200 px-2 py-2 text-center font-semibold ${
                    d.isToday ? "bg-orange-50 text-orange-700" : "text-zinc-700"
                  }`}
                >
                  <div>{d.label}</div>
                  <div className="text-xs text-zinc-500">{d.date}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id}>
                <td className="border-b border-zinc-100 px-2 py-2 align-top font-semibold text-zinc-800">
                  {site.name}
                </td>
                {days.map((d) => {
                  const items = cellAssignments(site.id, d.ymd);
                  return (
                    <td
                      key={d.ymd}
                      className={`min-w-[88px] border-b border-zinc-100 px-1 py-2 align-top ${
                        d.isToday ? "bg-orange-50/50" : ""
                      }`}
                    >
                      {items.length === 0 ? (
                        <p className="text-center text-xs text-zinc-400">・</p>
                      ) : (
                        <ul className="space-y-1">
                          {items.map((a) => {
                            const night = isNight(a.shift);
                            const half = isHalf(a.shift);
                            const changed = a.status === "changed";
                            return (
                              <li
                                key={a.id}
                                className={`rounded-md px-2 py-1 text-xs font-semibold leading-tight ${
                                  night
                                    ? "bg-indigo-900 text-white"
                                    : half
                                      ? "bg-orange-200 text-orange-900"
                                      : "bg-orange-500 text-white"
                                } ${changed ? "ring-2 ring-red-500" : ""}`}
                              >
                                <span className="mr-1">{night ? "🌙" : "☀"}</span>
                                {a.userName}
                                <span className="ml-1 text-[10px] opacity-80">
                                  {SHIFT_LABEL_SHORT[a.shift]}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-zinc-600">
        ☀ 日勤 ／ 🌙 夜勤 ／ 半分塗り＝半日 ／ 赤枠＝当日に変更あり
      </p>
    </section>
  );
}
