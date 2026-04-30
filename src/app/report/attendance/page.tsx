"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { attendanceRecords, projects, workers } from "@/data/mock";

export default function ReportAttendancePage() {
  const [clocked, setClocked] = useState(false);
  const today = attendanceRecords.filter((a) => a.workerId === "w1");

  return (
    <PageShell
      mode="report"
      title="勤怠（打刻）"
      listHref="/report"
      listLabel="メニューへ"
    >
      <DemoDisclaimer context="data" />
      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-zinc-600">本日の対象</p>
        <p className="text-lg font-bold text-zinc-900">
          {workers.find((w) => w.id === "w1")?.name} /{" "}
          {projects.find((p) => p.id === "p1")?.projectName}
        </p>
        <button
          type="button"
          onClick={() => setClocked((v) => !v)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-md"
        >
          <Clock className="h-6 w-6" aria-hidden />
          {clocked ? "退勤を記録（デモ）" : "出勤を記録（デモ）"}
        </button>
        <p className="mt-2 text-center text-xs text-zinc-500">
          タップで状態が切り替わる演出のみです。実データは保存されません。
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="font-semibold text-zinc-900">当日サマリー（デモ）</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-700">
          {today.map((a) => {
            const w = workers.find((x) => x.id === a.workerId);
            return (
              <li key={a.id} className="flex justify-between border-b border-zinc-100 py-2 last:border-0">
                <span>{w?.name}</span>
                <span>
                  出 {a.clockIn}
                  {a.clockOut ? ` ／ 退 ${a.clockOut}` : " ／ 勤務中"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </PageShell>
  );
}
