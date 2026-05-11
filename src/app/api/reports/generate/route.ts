import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";
import { collectReportData } from "@/lib/report/data-collector";
import { generateReportPDF } from "@/lib/report/pdf-generator";
import { getTemplateById } from "@/lib/report/templates-repository";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { isSupabaseServerWriteable } from "@/lib/supabase/config";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const user = await getSessionFromCookies();
  if (!user || (user.role !== "admin" && user.role !== "owner")) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  let body: {
    templateId?: string;
    siteId?: string;
    periodStart?: string;
    periodEnd?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON が不正です" }, { status: 400 });
  }

  const { templateId, siteId, periodStart, periodEnd } = body;
  if (!templateId || !siteId || !periodStart || !periodEnd) {
    return NextResponse.json(
      { error: "templateId, siteId, periodStart, periodEnd は必須です" },
      { status: 400 },
    );
  }

  const template = await getTemplateById(templateId);
  if (!template) {
    return NextResponse.json({ error: "テンプレが見つかりません" }, { status: 404 });
  }

  const data = await collectReportData(template, siteId, {
    periodStart,
    periodEnd,
  });

  let pdf: Buffer;
  try {
    pdf = await generateReportPDF(template, data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "PDF 生成に失敗しました" }, { status: 500 });
  }

  let pdfUrl = `inline://${template.id}-${siteId}.pdf`;
  if (isSupabaseServerWriteable) {
    try {
      const supabase = createServiceRoleClient();
      if (supabase) {
        const path = `reports/${siteId}/${template.id}_${periodStart}_${periodEnd}.pdf`;
        const bucket = "report-pdfs";
        const { error: upErr } = await supabase.storage.from(bucket).upload(path, pdf, {
          contentType: "application/pdf",
          upsert: true,
        });
        if (!upErr) {
          const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
          pdfUrl = pub.publicUrl;
        }
        const uuidLike =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            siteId,
          );
        if (uuidLike) {
          await supabase.from("report_outputs").insert({
            template_id: template.id,
            site_id: siteId,
            period_start: periodStart,
            period_end: periodEnd,
            pdf_url: pdfUrl,
            status: "draft",
            generated_by: null,
          });
        }
      }
    } catch (e) {
      console.warn("[reports/generate] storage / outputs skipped", e);
    }
  }

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(template.name)}_${periodEnd}.pdf"`,
      "X-Report-Pdf-Url": pdfUrl,
    },
  });
}
