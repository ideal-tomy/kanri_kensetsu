"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Assignment, AssignmentStatus, ShiftType } from "@/lib/prototype-store";
import { COPY, SHIFT_LABEL_SHORT } from "@/lib/copy";

type Site = { id: string; name: string };

const SHIFT_OPTIONS: ShiftType[] = [
  "day_full",
  "day_am",
  "day_pm",
  "night_full",
  "night_early",
  "night_late",
];

const STATUS_OPTIONS: AssignmentStatus[] = ["planned", "confirmed", "changed", "cancelled"];

const isNight = (s: ShiftType) => s.startsWith("night");
const isHalf = (s: ShiftType) =>
  s.endsWith("am") || s.endsWith("pm") || s === "night_early" || s === "night_late";

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

function compactWorkerName(name: string) {
  return name.replace(/さん$/, "").trim().slice(0, 6);
}

export function WeekCalendar({
  sites,
  assignments: assignmentsProp,
  todayStr,
  editable = true,
}: {
  sites: Site[];
  assignments: Assignment[];
  todayStr: string;
  editable?: boolean;
}) {
  const router = useRouter();
  const [weekOffset, setWeekOffset] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [overflowCell, setOverflowCell] = useState<{
    siteName: string;
    dayLabel: string;
    items: Assignment[];
  } | null>(null);
  const [formSiteId, setFormSiteId] = useState("");
  const [formShift, setFormShift] = useState<ShiftType>("day_full");
  const [formDate, setFormDate] = useState("");
  const [formStatus, setFormStatus] = useState<AssignmentStatus>("planned");
  const [formReason, setFormReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    assignmentsProp.filter((a) => a.siteId === siteId && a.workDate === ymd);

  const headerLabel = `${monday.getMonth() + 1}/${monday.getDate()} 〜 ${days[6].date}`;

  const openEditor = (a: Assignment) => {
    setEditing(a);
    setFormSiteId(a.siteId);
    setFormShift(a.shift);
    setFormDate(a.workDate);
    setFormStatus(a.status);
    setFormReason("");
    setErrorMsg("");
    setEditorOpen(true);
    setOverflowCell(null);
  };

  const patchAssignment = async (body: Record<string, unknown>) => {
    if (!editing) return;
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/assignments/${editing.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(typeof data.message === "string" ? data.message : "更新に失敗しました");
        return;
      }
      setEditorOpen(false);
      setEditing(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    void patchAssignment({
      siteId: formSiteId,
      shift: formShift,
      workDate: formDate,
      status: formStatus,
      reason: formReason.trim() || undefined,
    });
  };

  const handleCancelAssignment = () => {
    void patchAssignment({
      status: "cancelled",
      reason: formReason.trim() || "配員取消",
    });
  };

  const renderChip = (a: Assignment, opts: { compact: boolean; tabIndex?: number }) => {
    const night = isNight(a.shift);
    const half = isHalf(a.shift);
    const changed = a.status === "changed";
    const label = opts.compact ? compactWorkerName(a.userName) : a.userName;
    const cls = `flex min-h-11 w-full items-center justify-start gap-0.5 rounded-md px-2 py-1.5 text-left text-xs font-semibold leading-tight md:min-h-0 ${
      night
        ? "bg-indigo-900 text-white"
        : half
          ? "bg-orange-200 text-orange-900"
          : "bg-orange-500 text-white"
    } ${changed ? "ring-2 ring-red-500" : ""}`;
    const inner = (
      <>
        <span className="shrink-0">{night ? "🌙" : "☀"}</span>
        <span className={`min-w-0 ${opts.compact ? "truncate md:max-w-none" : ""}`}>{label}</span>
        <span className={`ml-auto shrink-0 text-[10px] opacity-80 ${opts.compact ? "hidden sm:inline" : ""}`}>
          {SHIFT_LABEL_SHORT[a.shift]}
        </span>
      </>
    );
    if (!editable) {
      return (
        <div className={cls} tabIndex={opts.tabIndex}>
          {inner}
        </div>
      );
    }
    return (
      <button type="button" className={cls} tabIndex={opts.tabIndex} onClick={() => openEditor(a)}>
        {inner}
      </button>
    );
  };

  const MAX_VISIBLE_MOBILE = 2;

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

      <div className="mt-3 overflow-x-auto md:overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 max-w-[6.5rem] border-b border-zinc-200 bg-white px-1 py-2 text-left md:max-w-none md:bg-transparent">
                現場
              </th>
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
                <td className="sticky left-0 z-10 max-w-[6.5rem] border-b border-zinc-100 bg-white px-1 py-2 align-top font-semibold text-zinc-800 md:max-w-none md:bg-transparent">
                  <span className="line-clamp-2 md:line-clamp-none" title={site.name}>
                    {site.name}
                  </span>
                </td>
                {days.map((d) => {
                  const items = cellAssignments(site.id, d.ymd);
                  const hiddenMobileCount =
                    items.length > MAX_VISIBLE_MOBILE ? items.length - MAX_VISIBLE_MOBILE : 0;
                  return (
                    <td
                      key={d.ymd}
                      className={`min-w-[88px] border-b border-zinc-100 px-1 py-2 align-top ${
                        d.isToday ? "bg-orange-50/50" : ""
                      }`}
                    >
                      {items.length === 0 ? (
                        <p className="py-2 text-center text-xs text-zinc-400">・</p>
                      ) : (
                        <>
                          <ul className="space-y-1 md:hidden">
                            {items.slice(0, MAX_VISIBLE_MOBILE).map((a) => (
                              <li key={a.id}>{renderChip(a, { compact: true })}</li>
                            ))}
                            {hiddenMobileCount > 0 ? (
                              <li>
                                <button
                                  type="button"
                                  className="min-h-11 w-full rounded-md border border-zinc-300 bg-zinc-50 px-2 py-2 text-xs font-semibold text-zinc-700"
                                  onClick={() =>
                                    setOverflowCell({
                                      siteName: site.name,
                                      dayLabel: `${d.label} ${d.date}`,
                                      items,
                                    })
                                  }
                                >
                                  +{hiddenMobileCount} 件を表示
                                </button>
                              </li>
                            ) : null}
                          </ul>
                          <ul className="hidden space-y-1 md:block">
                            {items.map((a) => (
                              <li key={a.id}>{renderChip(a, { compact: false })}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 hidden text-xs text-zinc-600 md:block">
        ☀ 日勤 ／ 🌙 夜勤 ／ 半分塗り＝半日 ／ 赤枠＝当日に変更あり
      </p>
      <details className="mt-2 md:hidden">
        <summary className="cursor-pointer text-xs text-zinc-600">凡例（タップで開く）</summary>
        <p className="mt-1 text-xs text-zinc-600">
          ☀ 日勤 ／ 🌙 夜勤 ／ 半分塗り＝半日 ／ 赤枠＝当日に変更あり
        </p>
      </details>

      {overflowCell ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 md:items-center md:p-4"
          role="presentation"
          onClick={() => setOverflowCell(null)}
        >
          <div
            className="max-h-[min(85vh,560px)] w-full max-w-lg rounded-t-2xl bg-white p-4 shadow-xl md:rounded-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="overflow-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="overflow-title" className="font-bold text-zinc-900">
              {overflowCell.siteName}（{overflowCell.dayLabel}）
            </h3>
            <ul className="mt-3 max-h-[55vh] space-y-2 overflow-y-auto">
              {overflowCell.items.map((a) => (
                <li key={a.id}>{renderChip(a, { compact: false })}</li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-4 min-h-11 w-full rounded-lg bg-zinc-200 font-semibold text-zinc-800"
              onClick={() => setOverflowCell(null)}
            >
              閉じる
            </button>
          </div>
        </div>
      ) : null}

      {editorOpen && editing ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 md:items-center md:p-4"
          role="presentation"
          onClick={() => !saving && setEditorOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl md:rounded-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editor-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="editor-title" className="text-lg font-bold text-zinc-900">
              配員を編集
            </h3>
            <p className="mt-1 text-sm text-zinc-600">{editing.userName}</p>

            {errorMsg ? (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{errorMsg}</p>
            ) : null}

            <label className="mt-4 block text-xs font-semibold text-zinc-600">
              現場
              <select
                className="mt-1 flex min-h-11 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                value={formSiteId}
                onChange={(e) => setFormSiteId(e.target.value)}
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 block text-xs font-semibold text-zinc-600">
              シフト
              <select
                className="mt-1 flex min-h-11 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                value={formShift}
                onChange={(e) => setFormShift(e.target.value as ShiftType)}
              >
                {SHIFT_OPTIONS.map((key) => (
                  <option key={key} value={key}>
                    {COPY.shift[key]}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 block text-xs font-semibold text-zinc-600">
              勤務日（表示中の週）
              <select
                className="mt-1 flex min-h-11 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              >
                {days.map((d) => (
                  <option key={d.ymd} value={d.ymd}>
                    {d.label} {d.date}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 block text-xs font-semibold text-zinc-600">
              ステータス
              <select
                className="mt-1 flex min-h-11 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as AssignmentStatus)}
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st === "planned"
                      ? "予定"
                      : st === "confirmed"
                        ? "確定"
                        : st === "changed"
                          ? "変更あり"
                          : "取消"}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 block text-xs font-semibold text-zinc-600">
              理由（任意・現場変更時に記録）
              <textarea
                className="mt-1 min-h-[72px] w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                value={formReason}
                onChange={(e) => setFormReason(e.target.value)}
                placeholder="例：雨天対応で応援へ"
              />
            </label>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                disabled={saving}
                className="min-h-11 rounded-lg bg-zinc-900 font-semibold text-white disabled:opacity-50"
                onClick={() => void handleSave()}
              >
                保存
              </button>
              <button
                type="button"
                disabled={saving || editing.status === "cancelled"}
                className="min-h-11 rounded-lg border border-red-300 bg-red-50 font-semibold text-red-800 disabled:opacity-50"
                onClick={() => void handleCancelAssignment()}
              >
                配員を取消
              </button>
              <button
                type="button"
                disabled={saving}
                className="min-h-11 rounded-lg bg-zinc-200 font-semibold text-zinc-800"
                onClick={() => setEditorOpen(false)}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
