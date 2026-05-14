"use client";

import { useState } from "react";
import { COPY, PAUSE_REASON_LABEL, TASK_STATUS_LABEL } from "@/lib/copy";
import { PROGRESS_BAR_COLOR } from "@/lib/constants/units";
import { PauseReasonModal } from "@/components/task/pause-reason-modal";
import { QuantityInput } from "@/components/task/quantity-input";

type Task = {
  id: string;
  siteId: string;
  title: string;
  status: "not_started" | "in_progress" | "paused" | "completed";
  progressPct: number;
  unit?: string;
  plannedQty?: number;
  actualQty: number;
  todayTargetQty?: number;
  pausedReason?: "rain" | "material" | "manpower" | "other";
};

const STATUS_TONE: Record<Task["status"], string> = {
  not_started: "bg-zinc-200 text-zinc-800",
  in_progress: "bg-green-100 text-green-900",
  paused: "bg-red-100 text-red-900",
  completed: "bg-blue-100 text-blue-900",
};

export function TasksBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [message, setMessage] = useState("");
  const [pauseTargetId, setPauseTargetId] = useState<string | null>(null);
  const [celebrateId, setCelebrateId] = useState<string | null>(null);

  const reload = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.tasks ?? []);
  };

  const callPatch = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message ?? COPY.common.error_default);
      return null;
    }
    return data.task as Task;
  };

  const handleStart = async (task: Task) => {
    const updated = await callPatch(task.id, { status: "in_progress" });
    if (updated) {
      setMessage(`${task.title} を「${TASK_STATUS_LABEL.in_progress}」にしました`);
      void reload();
    }
  };

  const handlePause = (task: Task) => {
    setPauseTargetId(task.id);
  };

  const submitPause = async (reason: "rain" | "material" | "manpower" | "other") => {
    if (!pauseTargetId) return;
    const target = tasks.find((t) => t.id === pauseTargetId);
    const updated = await callPatch(pauseTargetId, { status: "paused", pausedReason: reason });
    if (updated) {
      setMessage(
        `${target?.title ?? "作業"} を「${TASK_STATUS_LABEL.paused}」にしました（理由：${PAUSE_REASON_LABEL[reason]}）`,
      );
      void reload();
    }
  };

  const handleComplete = async (task: Task) => {
    const updated = await callPatch(task.id, { status: "completed" });
    if (updated) {
      setMessage(COPY.task.completed_message);
      setCelebrateId(task.id);
      window.setTimeout(() => setCelebrateId(null), 1200);
      void reload();
    }
  };

  const handleAddQty = async (task: Task, delta: number) => {
    const updated = await callPatch(task.id, { qtyDelta: delta });
    if (updated) {
      setMessage(`${task.title} を ${delta > 0 ? "+" : ""}${delta}${task.unit ?? ""} 進めました`);
      if (updated.status === "completed") {
        setCelebrateId(task.id);
        window.setTimeout(() => setCelebrateId(null), 1200);
      }
      void reload();
    }
  };

  return (
    <>
      <header className="rounded-xl bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">{COPY.task.today}</h1>
        <p className="text-sm font-medium text-zinc-700">カードを操作して進捗を更新します</p>
        {message ? (
          <p className="mt-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white">
            {message}
          </p>
        ) : null}
      </header>

      {tasks.map((task) => {
        const showQuantity = task.plannedQty != null;
        const pct = showQuantity
          ? Math.round((task.actualQty / Math.max(1, task.plannedQty ?? 1)) * 100)
          : task.progressPct;
        const barColor = PROGRESS_BAR_COLOR(pct);
        const isCelebrating = celebrateId === task.id;

        return (
          <article
            key={task.id}
            className={`relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition ${
              isCelebrating ? "ring-4 ring-green-400" : "border-zinc-200"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-lg font-bold">{task.title}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_TONE[task.status]}`}
              >
                {TASK_STATUS_LABEL[task.status]}
              </span>
            </div>

            {showQuantity ? (
              <p className="mt-1 text-base font-semibold text-zinc-800">
                {task.actualQty} / {task.plannedQty} {task.unit ?? ""}
                <span className="ml-2 text-zinc-500">（{pct}%）</span>
              </p>
            ) : (
              <p className="mt-1 text-base font-semibold text-zinc-800">{pct}%</p>
            )}

            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-zinc-200">
              <div
                className={`h-full transition-all duration-500 ${barColor}`}
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>

            {task.status === "paused" && task.pausedReason ? (
              <p className="mt-2 text-sm font-semibold text-red-700">
                中断理由：{PAUSE_REASON_LABEL[task.pausedReason]}
              </p>
            ) : null}

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleStart(task)}
                className="min-h-[60px] rounded-xl bg-green-600 text-lg font-bold text-white shadow-md transition active:scale-95"
              >
                着手
              </button>
              <button
                type="button"
                onClick={() => handlePause(task)}
                className="min-h-[60px] rounded-xl bg-red-600 text-lg font-bold text-white shadow-md transition active:scale-95"
              >
                中断
              </button>
              <button
                type="button"
                onClick={() => handleComplete(task)}
                className="min-h-[60px] rounded-xl bg-blue-600 text-lg font-bold text-white shadow-md transition active:scale-95"
              >
                完了
              </button>
            </div>

            {showQuantity ? (
              <div className="mt-3">
                <QuantityInput
                  unit={task.unit}
                  current={task.actualQty}
                  planned={task.plannedQty}
                  onAdd={(delta) => handleAddQty(task, delta)}
                />
              </div>
            ) : null}

            {isCelebrating ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-green-50/80 text-2xl font-bold text-green-700">
                完了しました
              </div>
            ) : null}
          </article>
        );
      })}

      <PauseReasonModal
        open={pauseTargetId !== null}
        onClose={() => setPauseTargetId(null)}
        onSelect={(reason) => submitPause(reason)}
      />
    </>
  );
}
