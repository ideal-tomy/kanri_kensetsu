"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import Link from "next/link";

const defaultFieldsJson = `[
  { "key": "site_name", "label": "現場名", "type": "text", "auto_fill": "site.name" },
  { "key": "report_date", "label": "日付", "type": "text", "auto_fill": "today" },
  { "key": "free_text", "label": "記載欄", "type": "textarea" }
]`;

const defaultLayout = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body{font-family:system-ui,sans-serif;padding:24px;}
h1{font-size:18px;border-bottom:2px solid #ea580c;padding-bottom:8px;}
</style></head>
<body>
<h1>{{site_name}}</h1>
<p>日付: {{report_date}}</p>
<p>{{free_text}}</p>
</body></html>`;

export default function NewReportTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("custom");
  const [fieldsJson, setFieldsJson] = useState(defaultFieldsJson);
  const [layoutHtml, setLayoutHtml] = useState(defaultLayout);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    let fields: unknown;
    try {
      fields = JSON.parse(fieldsJson);
    } catch {
      setMsg("fields の JSON が不正です");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reports/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          description: "管理画面から作成",
          fields,
          layout_html: layoutHtml,
          submission_schedule: "on_demand",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "保存に失敗しました");
        return;
      }
      router.push("/admin/master/report-templates");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell
      mode="admin"
      title="報告書テンプレ · 新規"
      subtitle="fields JSON とレイアウト HTML を指定して保存（Supabase 必須）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "報告書テンプレ", href: "/admin/master/report-templates" },
        { label: "新規" },
      ]}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4">
        <label className="block">
          <span className="text-sm font-bold text-zinc-900">テンプレ名</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            placeholder="例：○○社向け週次報告"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-zinc-900">カテゴリ</span>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-zinc-900">fields（JSON）</span>
          <textarea
            value={fieldsJson}
            onChange={(e) => setFieldsJson(e.target.value)}
            rows={12}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-xs"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-zinc-900">レイアウト HTML（Handlebars）</span>
          <textarea
            value={layoutHtml}
            onChange={(e) => setLayoutHtml(e.target.value)}
            rows={14}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-xs"
          />
        </label>
        {msg ? <p className="text-sm text-red-600">{msg}</p> : null}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {loading ? "保存中…" : "保存"}
          </button>
          <Link
            href="/admin/master/report-templates"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800"
          >
            戻る
          </Link>
        </div>
      </form>
    </PageShell>
  );
}
