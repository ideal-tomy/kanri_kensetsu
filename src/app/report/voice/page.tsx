"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";

const rawTranscript =
  "A棟3F建具を6枚取り付け。午後に是正1件。";
const aiDraft =
  "本日、A棟3階において建具6枚の取付を実施しました。午後は既設枠まわりの是正を1件完了し、品質確認まで行いました。";
const checklist = [
  "使用材料の品番・数量を現場メモと照合",
  "是正箇所の写真を別途添付",
];

export default function ReportVoicePage() {
  const [recording, setRecording] = useState(false);

  return (
    <PageShell mode="report" title="ボイス日報" listHref="/report" listLabel="報告メニューへ">
      <DemoDisclaimer context="ai" />
      <div className="mx-auto max-w-md space-y-4">
        <button
          type="button"
          onClick={() => setRecording((prev) => !prev)}
          className={`w-full rounded-2xl px-5 py-6 text-left ${
            recording ? "bg-red-600 text-white" : "bg-white text-zinc-900"
          }`}
        >
          <span className="flex items-center gap-2 text-xl font-bold">
            <Mic className="h-6 w-6" aria-hidden />
            {recording ? "録音中..." : "録音開始"}
          </span>
          <p className="mt-2 text-sm">
            {recording ? "AIが音声を解析中です" : "タップして音声入力デモを開始"}
          </p>
        </button>

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold text-zinc-900">入力（文字起こしイメージ）</h2>
          <p className="mt-2 text-sm text-zinc-700">{rawTranscript}</p>
        </section>

        <section className="rounded-lg border border-sky-200 bg-sky-50 p-4">
          <h2 className="font-semibold text-sky-950">AIが整形した日報段落</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-800">{aiDraft}</p>
        </section>

        <section className="rounded-lg border border-amber-200 bg-amber-50/90 p-4">
          <h2 className="font-semibold text-amber-950">要確認（そのまま送信しない）</h2>
          <ul className="mt-2 list-inside list-disc text-sm text-amber-950">
            {checklist.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <p className="text-center text-sm">
          <Link href="/admin/documents" className="font-medium text-primary underline">
            PCの書類ハブで全文下書きを見る
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
