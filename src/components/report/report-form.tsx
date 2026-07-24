"use client";

import { useEffect, useMemo, useState } from "react";
import { VoiceInput } from "@/components/report/voice-input";
import { WorkReportPreview } from "@/components/report/work-report-preview";
import { COPY } from "@/lib/copy";
import { SAMPLE_WORK_REPORT_TEXT } from "@/lib/report/work-report-template";

type Site = { id: string; name: string };

export function ReportForm() {
  const [sites, setSites] = useState<Site[]>([]);
  const [siteId, setSiteId] = useState("");
  const [rawText, setRawText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [parseMemo, setParseMemo] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/sites")
      .then((res) => res.json())
      .then((data) => {
        const nextSites = data.sites ?? [];
        setSites(nextSites);
        if (nextSites.length === 1) {
          setSiteId(nextSites[0].id);
        }
      });
  }, []);

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === siteId),
    [siteId, sites],
  );

  const insertSample = () => {
    const siteName = selectedSite?.name ?? "〇〇ビル";
    setRawText(SAMPLE_WORK_REPORT_TEXT.replaceAll("〇〇ビル", siteName));
    setShowPreview(false);
    setMessage("サンプル文を挿入しました。「日報を生成」で帳票プレビューを確認できます");
  };

  const generatePreview = async () => {
    setMessage("");
    if (!rawText.trim()) {
      setMessage("報告内容を入力してください（サンプル挿入も利用できます）");
      return;
    }
    setShowPreview(true);
    try {
      const res = await fetch("/api/reports/parse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rawText }),
      });
      const data = await res.json();
      if (res.ok) {
        setParseMemo(JSON.stringify(data.parsed, null, 2));
      }
    } catch {
      setParseMemo("");
    }
  };

  const submit = async () => {
    setMessage("");
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ siteId, rawText }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message ?? COPY.common.error_default);
      return;
    }
    setMessage("送信しました。管理画面の「最新の動き」から詳細を確認できます。");
    setShowPreview(true);
  };

  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-xl font-bold">{COPY.report.create}</h2>
        {selectedSite ? (
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-800">
            現場：{selectedSite.name}
          </span>
        ) : null}
      </div>
      <p className="text-xs text-zinc-500">{COPY.common.required_note}</p>

      <label className="block text-sm font-semibold">
        現場 <span className="text-red-600">●</span>
        <select
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3"
        >
          <option value="">{COPY.report.site_select_placeholder}</option>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
      </label>
      <div className="rounded-xl bg-zinc-50 p-3">
        <p className="text-sm font-semibold text-zinc-700">{COPY.report.voice_hint}</p>
        <div className="mt-2 flex justify-center">
          <VoiceInput onResult={(text) => setRawText(text)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={insertSample}
          className="min-h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-800"
        >
          サンプル文を挿入
        </button>
      </div>

      <label className="block text-sm font-semibold">
        {COPY.report.text_hint}
        <textarea
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            setShowPreview(false);
          }}
          rows={8}
          className="mt-1 w-full rounded-lg border border-zinc-300 p-3 font-mono text-sm"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={generatePreview}
          className="min-h-[60px] rounded-xl bg-zinc-900 px-4 text-lg font-bold text-white"
        >
          {COPY.report.generate}
        </button>
        <button
          type="button"
          onClick={submit}
          className="min-h-[60px] rounded-xl bg-orange-500 px-4 text-lg font-bold text-white"
        >
          {COPY.report.send}
        </button>
      </div>

      {showPreview && rawText.trim() ? (
        <WorkReportPreview
          siteName={selectedSite?.name ?? "現場"}
          rawText={rawText}
        />
      ) : null}

      {parseMemo ? (
        <details className="rounded-lg bg-zinc-50 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-zinc-700">
            解析メモ（キーワード抽出）
          </summary>
          <pre className="mt-2 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100">
            {parseMemo}
          </pre>
        </details>
      ) : null}

      {message ? <p className="text-sm font-semibold text-red-700">{message}</p> : null}
    </section>
  );
}
