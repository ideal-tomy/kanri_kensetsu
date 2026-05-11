"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Mail, Send } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { state } from "@/lib/prototype-store";
import { SAMPLE_REPORT_TEMPLATES } from "@/lib/report/sample-templates";
import type { ReportTemplateRecord } from "@/types/report-template";

const DEFAULT_PERIOD_END = new Date().toISOString().slice(0, 10);
const DEFAULT_PERIOD_START = new Date(Date.now() - 7 * 86400000)
  .toISOString()
  .slice(0, 10);

function ReportOutputInner() {
  const [templates, setTemplates] = useState<ReportTemplateRecord[]>([]);
  const [templateId, setTemplateId] = useState("");
  const [siteId, setSiteId] = useState("site-1");
  const [periodStart, setPeriodStart] = useState(DEFAULT_PERIOD_START);
  const [periodEnd, setPeriodEnd] = useState(DEFAULT_PERIOD_END);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState("");

  const sites = state.sites;
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("siteId");
    if (q && sites.some((s) => s.id === q)) {
      setSiteId(q);
    }
  }, [searchParams, sites]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/reports/templates");
      if (!res.ok) {
        setTemplates(SAMPLE_REPORT_TEMPLATES);
        setTemplateId(SAMPLE_REPORT_TEMPLATES[0]?.id ?? "");
        return;
      }
      const data = await res.json();
      setTemplates(data.templates ?? []);
      if (data.templates?.[0]) {
        setTemplateId((prev) => prev || data.templates[0].id);
      }
    })();
  }, []);

  async function generatePdf() {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          siteId,
          periodStart,
          periodEnd,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setStatus(err.error ?? "PDF 生成に失敗しました");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${periodEnd}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      const hdr = res.headers.get("X-Report-Pdf-Url");
      setStatus(hdr ? `生成済み（保管URL: ${hdr}）` : "PDF をダウンロードしました");
    } finally {
      setLoading(false);
    }
  }

  async function sendStub() {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/reports/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: emails.split(",").map((s) => s.trim()).filter(Boolean),
          pdfUrl: "inline://last-generated",
        }),
      });
      const data = await res.json();
      setStatus(data.message ?? JSON.stringify(data));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell
      mode="admin"
      title="報告書出力"
      subtitle="テンプレ・現場・期間を選んで PDF を生成（または送信スタブ）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "報告書出力" },
      ]}
    >
      <div className="mx-auto max-w-lg space-y-4">
        <label className="block">
          <span className="text-sm font-bold text-zinc-900">テンプレ</span>
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-zinc-900">対象現場</span>
          <select
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-bold text-zinc-900">期間開始</span>
            <input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-zinc-900">期間終了</span>
            <input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={generatePdf}
            disabled={loading || !templateId}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            PDF を生成
          </button>
        </div>

        <label className="block">
          <span className="text-sm font-bold text-zinc-900">
            送信先メール（スタブ・カンマ区切り）
          </span>
          <input
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="example@example.com"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={sendStub}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-bold text-zinc-900 disabled:opacity-50"
        >
          <Mail className="h-4 w-4" />
          生成して送信（スタブ）
        </button>

        {status ? (
          <p className="rounded-lg bg-zinc-900 px-4 py-3 text-sm text-white">{status}</p>
        ) : null}
      </div>

      <p className="mt-8 text-center text-xs text-zinc-500">
        <Send className="mx-auto mb-1 h-4 w-4" aria-hidden />
        メール実送信は API をメールプロバイダに差し替えてください。
      </p>
      <p className="mt-4 text-center text-xs text-zinc-500">
        URL に <code className="rounded bg-zinc-200 px-1">?siteId=…</code>{" "}
        を付けると対象現場を事前に選べます（外壁サッシ詰まりデモ用）。
      </p>
    </PageShell>
  );
}

export default function ReportOutputPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-zinc-100 text-sm font-semibold text-zinc-500">
          読み込み中…
        </div>
      }
    >
      <ReportOutputInner />
    </Suspense>
  );
}
