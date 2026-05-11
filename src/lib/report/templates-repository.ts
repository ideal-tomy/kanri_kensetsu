import { createServiceRoleClient } from "@/lib/supabase/server";
import { isSupabaseServerWriteable } from "@/lib/supabase/config";
import {
  DEMO_REPORT_COMPANY_ID,
  SAMPLE_REPORT_TEMPLATES,
  findSampleTemplate,
} from "@/lib/report/sample-templates";
import type { ReportField, ReportTemplateRecord } from "@/types/report-template";

function rowToRecord(row: Record<string, unknown>): ReportTemplateRecord {
  return {
    id: row.id as string,
    company_id: row.company_id as string,
    name: row.name as string,
    category: (row.category as string) ?? null,
    description: (row.description as string) ?? null,
    fields: (row.fields as ReportField[]) ?? [],
    layout_html: (row.layout_html as string) ?? null,
    base_file_url: (row.base_file_url as string) ?? null,
    default_recipient_client_id: (row.default_recipient_client_id as string) ?? null,
    default_recipient_emails: (row.default_recipient_emails as string[]) ?? null,
    submission_schedule: (row.submission_schedule as string) ?? null,
    submission_day: (row.submission_day as string) ?? null,
    submission_time: row.submission_time ? String(row.submission_time) : null,
    is_active: Boolean(row.is_active),
  };
}

export async function getTemplateById(id: string): Promise<ReportTemplateRecord | null> {
  const sample = findSampleTemplate(id);
  if (sample) return sample;

  if (!isSupabaseServerWriteable) return null;
  const supabase = createServiceRoleClient();
  if (!supabase) return null;

  const { data } = await supabase.from("report_templates").select("*").eq("id", id).maybeSingle();
  if (!data) return null;
  return rowToRecord(data as Record<string, unknown>);
}

export async function listTemplates(): Promise<ReportTemplateRecord[]> {
  if (!isSupabaseServerWriteable) {
    return SAMPLE_REPORT_TEMPLATES;
  }
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return SAMPLE_REPORT_TEMPLATES;
  }

  const { data, error } = await supabase
    .from("report_templates")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error || !data?.length) {
    return SAMPLE_REPORT_TEMPLATES;
  }

  const fromDb = data.map((r) => rowToRecord(r as Record<string, unknown>));
  const merged = [...fromDb];
  for (const s of SAMPLE_REPORT_TEMPLATES) {
    if (!merged.some((m) => m.id === s.id)) {
      merged.push(s);
    }
  }
  return merged;
}

export async function insertTemplate(
  row: Omit<ReportTemplateRecord, "id"> & { id?: string },
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseServerWriteable) {
    return { ok: false, error: "Supabase サービスロールが未設定のため保存できません（デモはサンプルのみ）。" };
  }
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Supabase クライアントを作成できませんでした。" };
  }

  const payload = {
    id: row.id,
    company_id: row.company_id || DEMO_REPORT_COMPANY_ID,
    name: row.name,
    category: row.category,
    description: row.description,
    fields: row.fields,
    layout_html: row.layout_html,
    base_file_url: row.base_file_url,
    default_recipient_client_id: row.default_recipient_client_id,
    default_recipient_emails: row.default_recipient_emails,
    submission_schedule: row.submission_schedule,
    submission_day: row.submission_day,
    submission_time: row.submission_time,
    is_active: row.is_active,
  };

  const { error } = await supabase.from("report_templates").insert(payload);
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
