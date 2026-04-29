"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";

export default function ReportDefectsPage() {
  const [sent, setSent] = useState(false);
  const [text, setText] = useState("扉下端に施工不良の可能性を確認");

  return (
    <PageShell
      mode="report"
      title="不具合・傷報告"
      listHref="/report"
      listLabel="報告メニューへ"
    >
      <div className="mx-auto max-w-md space-y-4">
        <textarea
          className="min-h-28 w-full rounded-lg border border-zinc-300 bg-white p-3"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="button"
          className="w-full rounded-xl bg-orange-600 py-3 font-semibold text-white"
          onClick={() => setSent(true)}
        >
          アラート送信
        </button>
        {sent ? (
          <div className="rounded-md bg-zinc-900 px-4 py-3 text-sm text-white">
            異常報告を送信しました。管理画面の連携・アラートに反映済み（デモ）。
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
