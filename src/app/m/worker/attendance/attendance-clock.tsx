"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

interface AttendanceClockProps {
  workerName: string;
  siteName?: string;
}

export function AttendanceClock({ workerName, siteName }: AttendanceClockProps) {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockedOut, setClockedOut] = useState(false);
  const [clockInTime, setClockInTime] = useState<string>();
  const [clockOutTime, setClockOutTime] = useState<string>();

  const now = () => new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

  const handlePunch = () => {
    if (!clockedIn) {
      setClockedIn(true);
      setClockInTime(now());
      return;
    }
    if (!clockedOut) {
      setClockedOut(true);
      setClockOutTime(now());
    }
  };

  const buttonLabel = !clockedIn
    ? "出勤を記録（デモ）"
    : !clockedOut
    ? "退勤を記録（デモ）"
    : "本日の打刻は完了しました";

  return (
    <section className="rounded-xl border-2 border-zinc-300 bg-white p-4">
      <p className="text-sm font-semibold text-zinc-600">本日の対象</p>
      <p className="mt-1 text-xl font-bold text-zinc-900">{workerName}</p>
      <p className="text-base font-semibold text-zinc-800">{siteName ?? "今日は配置がありません"}</p>

      <button
        type="button"
        onClick={handlePunch}
        disabled={clockedOut}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-4 text-lg font-bold text-white shadow-md disabled:bg-zinc-400"
      >
        <Clock className="h-6 w-6" aria-hidden />
        {buttonLabel}
      </button>

      <div className="mt-4 space-y-1 text-base font-semibold text-zinc-900">
        <p>出勤: {clockInTime ?? "--:--"}</p>
        <p>退勤: {clockOutTime ?? "--:--"}</p>
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        ※デモ画面です。タップで状態が切り替わる演出のみで、実データは保存されません。
      </p>
    </section>
  );
}
