import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";
import { insertTemplate, listTemplates } from "@/lib/report/templates-repository";
import type { ReportField, ReportTemplateRecord } from "@/types/report-template";

export async function GET() {
  const user = await getSessionFromCookies();
  if (!user || (user.role !== "admin" && user.role !== "owner")) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }
  const templates = await listTemplates();
  return NextResponse.json({ templates });
}

export async function POST(req: Request) {
  const user = await getSessionFromCookies();
  if (!user || (user.role !== "admin" && user.role !== "owner")) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  let body: Partial<ReportTemplateRecord> & { fields?: ReportField[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON が不正です" }, { status: 400 });
  }

  if (!body.name || !body.fields) {
    return NextResponse.json({ error: "name と fields は必須です" }, { status: 400 });
  }

  const row: Omit<ReportTemplateRecord, "id"> & { id?: string } = {
    company_id: body.company_id ?? "",
    name: body.name,
    category: body.category ?? null,
    description: body.description ?? null,
    fields: body.fields,
    layout_html: body.layout_html ?? null,
    base_file_url: body.base_file_url ?? null,
    default_recipient_client_id: body.default_recipient_client_id ?? null,
    default_recipient_emails: body.default_recipient_emails ?? null,
    submission_schedule: body.submission_schedule ?? null,
    submission_day: body.submission_day ?? null,
    submission_time: body.submission_time ?? null,
    is_active: body.is_active ?? true,
  };

  const result = await insertTemplate(row);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
