import { createServiceRoleClient } from "@/lib/supabase/server";
import { isSupabaseServerWriteable } from "@/lib/supabase/config";
import { state } from "@/lib/prototype-store";
import type { ReportTemplateRecord } from "@/types/report-template";

export type CollectPeriod = {
  periodStart: string;
  periodEnd: string;
};

function inPeriod(iso: string, start: string, end: string): boolean {
  const d = iso.slice(0, 10);
  return d >= start && d <= end;
}

/**
 * prototype-store から報告書用データを収集（デモ／オフライン）。
 */
export function collectReportDataFromPrototype(
  template: ReportTemplateRecord,
  siteId: string,
  period: CollectPeriod,
): Record<string, unknown> {
  const site = state.sites.find((s) => s.id === siteId);
  const siteName = site?.name ?? "（現場不明）";
  const overallProgress = site?.overallProgress ?? 0;

  const tasks = state.tasks.filter((t) => t.siteId === siteId);
  const completed_tasks = tasks
    .filter((t) => t.status === "completed")
    .map((t) => ({
      title: t.title,
      unit: t.unit ?? "",
      actual_qty: String(t.actualQty ?? ""),
    }));

  const active_tasks = tasks
    .filter((t) => t.status === "in_progress" || t.status === "paused")
    .map((t) => ({
      title: t.title,
      progress_pct: String(t.progressPct),
    }));

  const photos = state.photoReports.filter(
    (p) => p.siteId === siteId && inPeriod(p.createdAt, period.periodStart, period.periodEnd),
  );

  const progressPhotos = photos.filter((p) => p.category === "progress");

  const recentPhotos = photos.slice(0, 8);

  const photo_lines_recent = recentPhotos.slice(0, 6).map(
    (p) =>
      `${p.userName}｜${p.title ?? p.category}｜${p.storagePath}`,
  );

  const photo_lines_progress = progressPhotos.slice(0, 8).map(
    (p) => `${p.userName}｜${p.title ?? "進捗"}｜${p.storagePath}`,
  );

  const reports = state.reports.filter(
    (r) => r.siteId === siteId && inPeriod(r.createdAt, period.periodStart, period.periodEnd),
  );

  const reports_snippet = reports.map((r) => `・${r.authorName}: ${r.rawText}`).join("\n").slice(0, 4000);

  const summary =
    reports.length > 0
      ? reports.map((r) => r.rawText).join("\n---\n").slice(0, 2000)
      : "（この期間に登録された日報テキストはありません）";

  const phases_here = state.phases.filter((p) => p.siteId === siteId);
  const phases_summary = phases_here
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((p) => `${p.name}: ${p.progressPct}%`)
    .join(" / ");

  const base: Record<string, unknown> = {
    site_name: siteName,
    site_address: "",
    report_date: period.periodEnd,
    today: period.periodEnd,
    overall_progress: overallProgress,
    period: `${period.periodStart} 〜 ${period.periodEnd}`,
    summary,
    reports_snippet,
    photo_lines: template.category === "safety" ? photo_lines_progress : photo_lines_recent,
    notes: "",
    completed_tasks,
    active_tasks,
    phases_summary,
  };

  return applyFieldsDefaults(template, base);
}

function applyFieldsDefaults(template: ReportTemplateRecord, data: Record<string, unknown>): Record<string, unknown> {
  const out = { ...data };
  for (const field of template.fields) {
    if ("auto_fill" in field && field.auto_fill && out[field.key] === undefined) {
      switch (field.auto_fill) {
        case "site.name":
          out[field.key] = out.site_name;
          break;
        case "today":
          out[field.key] = out.today ?? out.report_date;
          break;
        default:
          break;
      }
    }
  }
  return out;
}

/**
 * Supabase から収集（サービスロール）。RLS を迂回するため Route Handler のみから呼ぶこと。
 */
export async function collectReportDataFromSupabase(
  template: ReportTemplateRecord,
  siteId: string,
  period: CollectPeriod,
): Promise<Record<string, unknown> | null> {
  if (!isSupabaseServerWriteable) return null;
  const supabase = createServiceRoleClient();
  if (!supabase) return null;

  const { data: siteRow } = await supabase
    .from("sites")
    .select("id,name,address,overall_progress")
    .eq("id", siteId)
    .maybeSingle();

  const siteName = siteRow?.name ?? "（現場不明）";
  const siteAddress = siteRow?.address ?? "";
  const overallProgress = siteRow?.overall_progress ?? 0;

  const { data: taskRows } = await supabase
    .from("tasks")
    .select("title,status,progress_pct,unit,actual_qty,planned_qty")
    .eq("site_id", siteId);

  const tasks = taskRows ?? [];
  const completed_tasks = tasks
    .filter((t) => t.status === "completed")
    .map((t) => ({
      title: t.title as string,
      unit: (t.unit as string) ?? "",
      actual_qty: String(t.actual_qty ?? ""),
    }));

  const active_tasks = tasks
    .filter((t) => t.status === "in_progress" || t.status === "paused")
    .map((t) => ({
      title: t.title as string,
      progress_pct: String(t.progress_pct ?? ""),
    }));

  const { data: photoRows } = await supabase
    .from("photo_reports")
    .select("user_name,category,title,storage_path,created_at")
    .eq("site_id", siteId)
    .gte("created_at", `${period.periodStart}T00:00:00`)
    .lte("created_at", `${period.periodEnd}T23:59:59`);

  const photos = photoRows ?? [];
  const progressPhotos = photos.filter((p) => p.category === "progress");
  const photo_lines_recent = photos.slice(0, 6).map(
    (p) =>
      `${p.user_name}｜${p.title ?? p.category}｜${p.storage_path}`,
  );
  const photo_lines_progress = progressPhotos.slice(0, 8).map(
    (p) => `${p.user_name}｜${p.title ?? "進捗"}｜${p.storage_path}`,
  );

  const { data: reportRows } = await supabase
    .from("reports")
    .select("author_name,raw_text,created_at")
    .eq("site_id", siteId)
    .gte("created_at", `${period.periodStart}T00:00:00`)
    .lte("created_at", `${period.periodEnd}T23:59:59`);

  const reports = reportRows ?? [];
  const reports_snippet = reports
    .map((r) => `・${r.author_name}: ${r.raw_text}`)
    .join("\n")
    .slice(0, 4000);

  const summary =
    reports.length > 0
      ? reports.map((r) => r.raw_text as string).join("\n---\n").slice(0, 2000)
      : "（この期間に登録された日報テキストはありません）";

  const base: Record<string, unknown> = {
    site_name: siteName,
    site_address: siteAddress,
    report_date: period.periodEnd,
    today: period.periodEnd,
    overall_progress: overallProgress,
    period: `${period.periodStart} 〜 ${period.periodEnd}`,
    summary,
    reports_snippet,
    photo_lines: template.category === "safety" ? photo_lines_progress : photo_lines_recent,
    notes: "",
    completed_tasks,
    active_tasks,
  };

  return applyFieldsDefaults(template, base);
}

export async function collectReportData(
  template: ReportTemplateRecord,
  siteId: string,
  period: CollectPeriod,
): Promise<Record<string, unknown>> {
  const fromDb = await collectReportDataFromSupabase(template, siteId, period);
  if (fromDb) return fromDb;
  return collectReportDataFromPrototype(template, siteId, period);
}
