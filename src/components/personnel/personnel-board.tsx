"use client";

import { useState } from "react";
import { COPY } from "@/lib/copy";
import { WeekCalendar } from "@/components/personnel/week-calendar";
import { PersonalWeek } from "@/components/personnel/personal-week";

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

type Change = {
  id: string;
  reason: string;
  beforeSiteName: string;
  afterSiteName: string;
  acknowledgedBy: string[];
};

type Mode = "week" | "personal";

export function PersonnelBoard({
  initialAssignments,
  initialSites,
}: {
  initialAssignments: Assignment[];
  initialSites: Site[];
}) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [changes, setChanges] = useState<Change[]>([]);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      return "personal";
    }
    return "week";
  });

  const todayStr = new Date().toISOString().slice(0, 10);

  const reload = async () => {
    const res = await fetch("/api/assignments");
    const data = await res.json();
    setAssignments(data.assignments ?? []);
  };

  const changeNow = async () => {
    if (assignments.length === 0) return;
    const target = assignments[0];
    const res = await fetch(`/api/assignments/${target.id}/change`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ afterSiteName: "応援現場", reason: "雨天で入れ替え" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message ?? COPY.common.error_default);
      return;
    }
    setChanges((prev) => [data.change, ...prev]);
    setMessage("急な変更を反映しました");
    void reload();
  };

  const acknowledge = async (change: Change) => {
    const res = await fetch(`/api/assignment-changes/${change.id}/acknowledge`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userName: "田中さん" }),
    });
    const data = await res.json();
    if (!res.ok) return;
    setChanges((prev) => prev.map((item) => (item.id === change.id ? data.change : item)));
  };

  return (
    <>
      <header className="rounded-xl bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">{COPY.assignment.board_title}</h1>
        <p className="text-sm text-zinc-600">{COPY.assignment.week_subtitle}</p>
        {message ? (
          <p className="mt-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white">
            {message}
          </p>
        ) : null}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("week")}
            className={`min-h-11 flex-1 rounded-lg px-3 font-semibold ${
              mode === "week" ? "bg-orange-500 text-white" : "bg-zinc-100 text-zinc-800"
            }`}
          >
            {COPY.assignment.week_view}
          </button>
          <button
            type="button"
            onClick={() => setMode("personal")}
            className={`min-h-11 flex-1 rounded-lg px-3 font-semibold ${
              mode === "personal" ? "bg-orange-500 text-white" : "bg-zinc-100 text-zinc-800"
            }`}
          >
            {COPY.assignment.personal_view}
          </button>
          <button
            type="button"
            onClick={changeNow}
            className="min-h-11 rounded-lg bg-red-600 px-3 font-bold text-white shadow-md"
          >
            {COPY.assignment.change_button}
          </button>
        </div>
      </header>

      {mode === "week" ? (
        <WeekCalendar sites={initialSites} assignments={assignments} todayStr={todayStr} />
      ) : (
        <PersonalWeek assignments={assignments} todayStr={todayStr} />
      )}

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-bold">変更カード</h2>
        {changes.length === 0 ? (
          <p className="text-sm text-zinc-600">{COPY.common.empty}</p>
        ) : null}
        {changes.map((change) => (
          <article key={change.id} className="mt-2 rounded-lg border border-red-300 bg-red-50 p-3">
            <p className="font-semibold text-red-800">
              {change.beforeSiteName} → {change.afterSiteName}
            </p>
            <p className="text-sm text-zinc-700">理由：{change.reason}</p>
            <button
              type="button"
              onClick={() => acknowledge(change)}
              className="mt-2 min-h-11 rounded-lg bg-zinc-900 px-4 font-semibold text-white"
            >
              {COPY.assignment.acknowledge}（{change.acknowledgedBy.length}）
            </button>
          </article>
        ))}
      </section>
    </>
  );
}
