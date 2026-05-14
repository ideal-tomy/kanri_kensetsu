"use client";

import { useMemo, useState } from "react";
import { COPY } from "@/lib/copy";
import { PROGRESS_BAR_COLOR } from "@/lib/constants/units";

type Site = {
  id: string;
  name: string;
  startedAt?: string;
  endedAt?: string;
  overallProgress: number;
  status: "active" | "completed";
};

const formatDate = (iso?: string) => {
  if (!iso) return "未設定";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;
};

export function OverallProgressCard({
  site: initial,
  authorName = "監督",
}: {
  site: Site;
  authorName?: string;
}) {
  const [site, setSite] = useState(initial);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<number>(initial.overallProgress);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const quickValues = useMemo(() => {
    const base = Math.round(site.overallProgress / 5) * 5;
    return [base - 10, base - 5, base, base + 5, base + 10]
      .map((v) => Math.max(0, Math.min(100, v)))
      .filter((v, i, arr) => arr.indexOf(v) === i);
  }, [site.overallProgress]);

  const submit = async () => {
    setMessage("");
    const res = await fetch(`/api/sites/${site.id}/progress`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        progressTo: draft,
        userName: authorName,
        comment: comment.trim() || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message ?? COPY.common.error_default);
      return;
    }
    setSite(data.site);
    setOpen(false);
    setComment("");
  };

  const barColor = PROGRESS_BAR_COLOR(site.overallProgress);

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-zinc-500">{COPY.site.overall_progress}</p>
          <p className="text-2xl font-bold">{site.overallProgress}%</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDraft(site.overallProgress);
            setOpen(true);
          }}
          className="min-h-11 rounded-lg bg-zinc-900 px-4 font-semibold text-white"
        >
          {COPY.site.change_progress}
        </button>
      </div>

      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${site.overallProgress}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-zinc-600">
        着工 {formatDate(site.startedAt)} ／ 引渡 {formatDate(site.endedAt)}
      </p>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-4 sm:rounded-2xl">
            <p className="text-lg font-bold">現場全体の進捗を更新</p>
            <p className="text-sm font-medium text-zinc-700">現在：{site.overallProgress}%</p>

            <div className="mt-3 grid grid-cols-5 gap-2">
              {quickValues.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setDraft(v)}
                  className={`min-h-[60px] rounded-xl text-lg font-bold transition active:scale-95 ${
                    draft === v ? "bg-orange-500 text-white" : "bg-zinc-100 text-zinc-800"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <label className="mt-3 block text-sm font-semibold text-zinc-700">
              数値入力（%）：
              <input
                type="number"
                min={0}
                max={100}
                value={draft}
                onChange={(e) => setDraft(Number(e.target.value))}
                className="ml-2 min-h-[44px] w-24 rounded-lg border border-zinc-300 px-3 text-lg font-bold"
              />
              <span className="ml-1">%</span>
            </label>

            <label className="mt-3 block text-sm font-semibold text-zinc-700">
              コメント（任意）
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder={COPY.site.progress_comment_placeholder}
                className="mt-1 w-full rounded-lg border border-zinc-300 p-3"
              />
            </label>

            {message ? (
              <p className="mt-2 text-sm font-semibold text-red-700">{message}</p>
            ) : null}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-[60px] rounded-xl bg-zinc-200 text-lg font-bold text-zinc-800"
              >
                {COPY.common.cancel}
              </button>
              <button
                type="button"
                onClick={submit}
                className="min-h-[60px] rounded-xl bg-orange-500 text-lg font-bold text-white"
              >
                {COPY.common.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
