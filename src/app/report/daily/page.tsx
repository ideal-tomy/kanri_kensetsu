"use client";

import { useMemo, useState } from "react";
import { Camera, Mic, Send, Type } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { DEMO_BRAND } from "@/config/demo-brand";
import { generateAutoPhotoName } from "@/lib/format";

const reportItems = [
  { id: "ky", label: "朝礼・KY実施" },
  { id: "arrival", label: "資材搬入・確認" },
  { id: "work", label: "施工中の進捗" },
  { id: "fix", label: "是正・手直し" },
  { id: "done", label: "完了確認" },
] as const;

export default function DailyReportPage() {
  const [uploaded, setUploaded] = useState<Record<string, string>>({});
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [freeText, setFreeText] = useState("");
  const [toast, setToast] = useState("");

  const completedCount = useMemo(
    () => Object.keys(uploaded).length,
    [uploaded],
  );

  const handlePick = (itemLabel: string, file?: File) => {
    if (!file) return;
    const autoName = generateAutoPhotoName("大阪現場", itemLabel);
    const folder = `drive://gempo/p1/daily/${itemLabel.replaceAll("・", "-")}/`;
    setUploaded((prev) => ({ ...prev, [itemLabel]: autoName }));
    setToast(
      `${file.name} -> ${autoName} に自動変換し、${folder}へ保存しました`,
    );
    window.setTimeout(() => setToast(""), 2500);
  };

  return (
    <PageShell mode="report" title="日報報告" listHref="/report" listLabel="メニューへ">
      <div className="mx-auto max-w-md space-y-4">
        <section className="rounded-xl border border-primary/20 bg-primary-muted/80 p-4">
          <p className="text-sm font-semibold text-zinc-900">一連の流れで報告</p>
          <p className="mt-1 text-sm text-zinc-700">
            朝のKYから完了まで、必要項目を上から順に埋めるだけです。
          </p>
          <p className="mt-2 text-xs text-zinc-600">
            進捗: {completedCount}/{reportItems.length} 項目で写真登録済み
          </p>
        </section>

        <section className="space-y-3">
          {reportItems.map((item, idx) => (
            <article key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-xs text-zinc-500">項目 {idx + 1}</p>
              <h2 className="text-base font-semibold text-zinc-900">{item.label}</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground">
                  <Camera className="h-4 w-4" />
                  画像アップ
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePick(item.label, e.target.files?.[0])}
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary bg-white py-2 text-sm font-semibold text-primary">
                  <Camera className="h-4 w-4" />
                  カメラ起動
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handlePick(item.label, e.target.files?.[0])}
                  />
                </label>
              </div>
              <p className="mt-2 text-xs text-zinc-600">
                命名: {DEMO_BRAND.companyName}_大阪現場_YYYYMMDD_{item.label}.jpg
              </p>
              {uploaded[item.label] ? (
                <p className="mt-1 text-sm font-semibold text-primary">
                  保存済み: {uploaded[item.label]}
                </p>
              ) : null}
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-base font-semibold text-zinc-900">追加の報告内容</h2>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setInputMode("voice")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold ${
                inputMode === "voice"
                  ? "bg-primary text-primary-foreground"
                  : "border border-zinc-300 bg-white text-zinc-700"
              }`}
            >
              <Mic className="h-4 w-4" />
              ボイス
            </button>
            <button
              type="button"
              onClick={() => setInputMode("text")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold ${
                inputMode === "text"
                  ? "bg-primary text-primary-foreground"
                  : "border border-zinc-300 bg-white text-zinc-700"
              }`}
            >
              <Type className="h-4 w-4" />
              テキスト
            </button>
          </div>
          {inputMode === "voice" ? (
            <button
              type="button"
              className="mt-3 w-full rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white"
            >
              ボイス入力を開始
            </button>
          ) : (
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              rows={4}
              placeholder="追記事項を入力"
              className="mt-3 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          )}
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Send className="h-4 w-4" />
            報告を送信（デモ）
          </button>
        </section>

        {toast ? (
          <div className="rounded-md bg-zinc-900 px-4 py-3 text-sm text-white">{toast}</div>
        ) : null}
      </div>
    </PageShell>
  );
}
