import type { ReportField, ReportTemplateRecord } from "@/types/report-template";

/** デモ会社コード YMD35 と対応するプレースホルダ company_id（Supabase 未使用時） */
export const DEMO_REPORT_COMPANY_ID = "00000000-0000-0000-0000-000000000001";

const dailyFields: ReportField[] = [
  { key: "site_name", label: "現場名", type: "text", auto_fill: "site.name" },
  { key: "report_date", label: "日付", type: "text", auto_fill: "today" },
  { key: "summary", label: "本日の内容", type: "textarea" },
  {
    key: "photos",
    label: "写真",
    type: "photo_list",
    max: 6,
    auto_source: "photos.recent",
  },
];

const dailyLayout = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body{font-family:system-ui,sans-serif;padding:24px;color:#18181b;}
h1{font-size:18px;border-bottom:2px solid #ea580c;padding-bottom:8px;}
.meta{font-size:12px;color:#71717a;margin:16px 0;}
.section{margin-top:16px;}
.photos{display:flex;flex-wrap:wrap;gap:8px;}
.ph{font-size:11px;color:#52525b;}
</style></head>
<body>
<h1>【日報】{{site_name}}</h1>
<p class="meta">日付: {{report_date}}　全体進捗: {{overall_progress}}%</p>
<div class="section"><strong>本日の業務・報告</strong><div>{{summary}}</div></div>
<div class="section"><strong>写真</strong><div class="photos">{{#each photo_lines}}<div class="ph">{{this}}</div>{{/each}}</div></div>
<div class="section"><strong>期間内の日報抜粋</strong><pre style="white-space:pre-wrap;font-size:11px;">{{reports_snippet}}</pre></div>
</body></html>
`;

const weeklyFields: ReportField[] = [
  { key: "site_name", label: "現場名", type: "text", auto_fill: "site.name" },
  { key: "period", label: "対象期間", type: "text" },
  {
    key: "tasks_done",
    label: "完了タスク",
    type: "task_list",
    filter: "completed",
  },
  {
    key: "tasks_active",
    label: "進行中タスク",
    type: "task_list",
    filter: "all",
  },
];

const weeklyLayout = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body{font-family:system-ui,sans-serif;padding:24px;}
h1{font-size:18px;border-bottom:2px solid #ea580c;padding-bottom:8px;}
table{border-collapse:collapse;width:100%;font-size:12px;margin-top:12px;}
th,td{border:1px solid #e4e4e7;padding:6px;text-align:left;}
</style></head>
<body>
<h1>【週次報告】{{site_name}}</h1>
<p>期間: {{period}}</p>
<h2>完了タスク</h2>
<table><thead><tr><th>業務名</th><th>単位</th><th>実績</th></tr></thead>
<tbody>{{#each completed_tasks}}<tr><td>{{title}}</td><td>{{unit}}</td><td>{{actual_qty}}</td></tr>{{/each}}</tbody></table>
<h2>進行中タスク</h2>
<table><thead><tr><th>業務名</th><th>進捗%</th></tr></thead>
<tbody>{{#each active_tasks}}<tr><td>{{title}}</td><td>{{progress_pct}}</td></tr>{{/each}}</tbody></table>
<p class="meta">工程進捗: {{phases_summary}}</p>
</body></html>
`;

const safetyFields: ReportField[] = [
  { key: "site_name", label: "現場名", type: "text", auto_fill: "site.name" },
  {
    key: "progress_photos",
    label: "安全巡回写真",
    type: "photo_list",
    max: 8,
    auto_source: "photos.by_category.progress",
  },
  { key: "notes", label: "指摘・フォロー", type: "textarea" },
];

const safetyLayout = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body{font-family:system-ui,sans-serif;padding:24px;}
h1{font-size:18px;}
.alert{background:#fef3c7;padding:12px;border-radius:8px;font-size:13px;}
</style></head>
<body>
<h1>【安全パトロール報告】{{site_name}}</h1>
<p class="alert">進捗報告カテゴリの写真を中心に自動収集しています。</p>
<p><strong>写真一覧</strong></p>
<ul>{{#each photo_lines}}<li>{{this}}</li>{{/each}}</ul>
<p><strong>補足</strong></p>
<p>{{notes}}</p>
</body></html>
`;

export const SAMPLE_REPORT_TEMPLATES: ReportTemplateRecord[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    company_id: DEMO_REPORT_COMPANY_ID,
    name: "日報（標準）",
    category: "daily",
    description: "日付・現場・写真・日報抜粋を1枚にまとめます。",
    fields: dailyFields,
    layout_html: dailyLayout,
    base_file_url: null,
    default_recipient_client_id: null,
    default_recipient_emails: null,
    submission_schedule: "daily",
    submission_day: null,
    submission_time: null,
    is_active: true,
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    company_id: DEMO_REPORT_COMPANY_ID,
    name: "週次報告（標準）",
    category: "weekly",
    description: "期間内の完了タスク・進行中タスクを一覧化します。",
    fields: weeklyFields,
    layout_html: weeklyLayout,
    base_file_url: null,
    default_recipient_client_id: null,
    default_recipient_emails: null,
    submission_schedule: "weekly",
    submission_day: "friday",
    submission_time: null,
    is_active: true,
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    company_id: DEMO_REPORT_COMPANY_ID,
    name: "安全パトロール（標準）",
    category: "safety",
    description: "進捗報告写真を中心に一覧します。",
    fields: safetyFields,
    layout_html: safetyLayout,
    base_file_url: null,
    default_recipient_client_id: null,
    default_recipient_emails: null,
    submission_schedule: "on_demand",
    submission_day: null,
    submission_time: null,
    is_active: true,
  },
];

export function findSampleTemplate(id: string): ReportTemplateRecord | undefined {
  return SAMPLE_REPORT_TEMPLATES.find((t) => t.id === id);
}
