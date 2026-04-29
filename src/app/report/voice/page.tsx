"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

export default function ReportVoicePage() {
  const [recording, setRecording] = useState(false);

  return (
    <PageShell mode="report" title="ボイス日報" listHref="/report" listLabel="報告メニューへ">
      <div className="mx-auto max-w-md space-y-4">
        <button
          type="button"
          onClick={() => setRecording((prev) => !prev)}
          className={`w-full rounded-2xl px-5 py-6 text-left ${
            recording ? "bg-red-600 text-white" : "bg-white text-zinc-900"
          }`}
        >
          <span className="flex items-center gap-2 text-xl font-bold">
            <Mic className="h-6 w-6" />
            {recording ? "録音中..." : "録音開始"}
          </span>
          <p className="mt-2 text-sm">
            {recording ? "AIが音声を解析中です" : "タップして音声入力デモを開始"}
          </p>
        </button>

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold">AI変換結果（デモ）</h2>
          <p className="mt-2 text-sm text-zinc-700">
            本日A棟3Fにて建具6枚を取り付け、午後に1件の是正対応を完了しました。
          </p>
        </section>
      </div>
    </PageShell>
  );
}
