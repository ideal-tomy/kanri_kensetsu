"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Bug, Camera } from "lucide-react";
import { BottomNav } from "@/components/nav/bottom-nav";

type Severity = "low" | "medium" | "high";

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: "low", label: "軽微" },
  { value: "medium", label: "通常" },
  { value: "high", label: "緊急" },
];

export default function WorkerDefectsPage() {
  const [severity, setSeverity] = useState<Severity>("medium");
  const [text, setText] = useState("");
  const [photoName, setPhotoName] = useState<string>();
  const [sent, setSent] = useState(false);

  const handlePhoto = (file?: File) => {
    if (!file) return;
    setPhotoName(file.name);
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    setSent(true);
  };

  const reset = () => {
    setSent(false);
    setText("");
    setPhotoName(undefined);
    setSeverity("medium");
  };

  return (
    <main className="space-y-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-zinc-900">
          <Bug className="h-6 w-6 text-primary" aria-hidden />
          不具合・傷報告
        </h1>
        <Link
          href="/m/worker"
          className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-bold text-zinc-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          もどる
        </Link>
      </div>

      {sent ? (
        <section className="rounded-xl border-2 border-orange-300 bg-orange-50 p-4">
          <p className="flex items-center gap-2 text-lg font-bold text-orange-900">
            <AlertTriangle className="h-5 w-5" aria-hidden />
            異常を報告しました
          </p>
          <p className="mt-2 text-base font-semibold text-zinc-800">
            管理画面の「現場報告確認」「アラート」に反映されます（デモ）。
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
          >
            もう一件報告する
          </button>
        </section>
      ) : (
        <>
          <section className="rounded-xl border-2 border-zinc-300 bg-white p-4">
            <h2 className="worker-readable text-xl">緊急度</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {SEVERITY_OPTIONS.map((option) => {
                const active = option.value === severity;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSeverity(option.value)}
                    className={`min-h-12 rounded-lg border-2 text-base font-bold ${
                      active
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-zinc-300 bg-white text-zinc-900"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border-2 border-zinc-300 bg-white p-4">
            <h2 className="worker-readable text-xl">内容</h2>
            <textarea
              className="mt-3 min-h-32 w-full rounded-lg border-2 border-zinc-300 bg-white p-3 text-base"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="例）扉下端に施工不良の可能性。隙間が約5mm。"
            />
          </section>

          <section className="rounded-xl border-2 border-zinc-300 bg-white p-4">
            <h2 className="worker-readable text-xl">写真</h2>
            <label className="mt-3 flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-zinc-300 bg-white text-base font-bold text-zinc-900">
              <Camera className="h-5 w-5" aria-hidden />
              写真を撮影 / 選択
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handlePhoto(e.target.files?.[0])}
              />
            </label>
            {photoName ? (
              <p className="mt-2 text-sm font-semibold text-zinc-700">添付: {photoName}</p>
            ) : null}
          </section>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-4 text-lg font-bold text-white shadow-md disabled:bg-zinc-400"
          >
            <AlertTriangle className="h-5 w-5" aria-hidden />
            アラート送信
          </button>
        </>
      )}

      <BottomNav role="worker" />
    </main>
  );
}
