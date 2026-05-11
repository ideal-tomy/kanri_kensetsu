"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { DEMO_BRAND } from "@/config/demo-brand";
import { generateAutoPhotoName } from "@/lib/format";

export default function ReportPhotoPage() {
  const [originalName, setOriginalName] = useState("");
  const [renamed, setRenamed] = useState("");
  const [toast, setToast] = useState("");

  const todayName = useMemo(
    () => generateAutoPhotoName("新宿現場", "完了", new Date("2026-04-29")),
    [],
  );

  const handleFile = (file?: File) => {
    if (!file) return;
    const autoName = generateAutoPhotoName("新宿現場", "完了");
    setOriginalName(file.name);
    setRenamed(autoName);
    setToast(`AIが ${autoName} に自動変更し、Google Driveへ保存しました`);
    window.setTimeout(() => setToast(""), 2500);
  };

  return (
    <PageShell mode="report" title="施工写真撮影" listHref="/report" listLabel="報告メニューへ">
      <div className="mx-auto max-w-md space-y-4">
        <label className="block rounded-2xl border border-zinc-200 bg-white p-6 text-center">
          <p className="text-lg font-semibold text-zinc-900">写真を選択</p>
          <p className="text-sm text-zinc-600">カメラ起動の代替としてファイル選択</p>
          <input
            type="file"
            accept="image/*"
            className="mt-4 block w-full text-sm"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
          <p>
            命名ルール: {DEMO_BRAND.companyName}_{"{現場名}"}_{"{YYYYMMDD}"}_
            {"{内容}"}.jpg
          </p>
          <p>デモ例: {todayName}</p>
          {originalName ? <p className="mt-2">元ファイル: {originalName}</p> : null}
          {renamed ? (
            <p className="font-semibold text-primary">自動リネーム後: {renamed}</p>
          ) : null}
        </section>

        {toast ? (
          <div className="rounded-md bg-zinc-900 px-4 py-3 text-sm text-white">{toast}</div>
        ) : null}
      </div>
    </PageShell>
  );
}
