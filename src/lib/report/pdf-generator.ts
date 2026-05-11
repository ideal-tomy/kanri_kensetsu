import Handlebars from "handlebars";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { ReportTemplateRecord } from "@/types/report-template";

Handlebars.registerHelper("eq", (a: unknown, b: unknown) => a === b);

/**
 * HTML を Playwright で PDF 化。失敗時は pdf-lib で簡易レイアウトにフォールバック。
 */
export async function generateReportPDF(
  template: ReportTemplateRecord,
  data: Record<string, unknown>,
): Promise<Buffer> {
  const html =
    template.layout_html?.trim() ??
    `<html><body><pre>{{json}}</pre></body></html>`;

  const compiled = Handlebars.compile(html, { noEscape: false });
  const merged = { ...data, json: JSON.stringify(data, null, 2) };
  const rendered = compiled(merged);

  try {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(rendered, { waitUntil: "domcontentloaded" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    });
    await browser.close();
    return Buffer.from(pdf);
  } catch (err) {
    console.warn("[pdf-generator] playwright failed, using pdf-lib fallback", err);
    return generatePdfLibFallback(template.name, merged, rendered);
  }
}

async function generatePdfLibFallback(
  title: string,
  data: Record<string, unknown>,
  htmlFallback: string,
): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([595.28, 841.89]);
  const margin = 48;
  let y = 800;

  page.drawText(title, {
    x: margin,
    y,
    size: 14,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 28;

  const plain = htmlFallback
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const lines = wrapText(plain, 90);
  const lineHeight = 12;
  for (const line of lines.slice(0, 55)) {
    if (y < 60) {
      page = doc.addPage([595.28, 841.89]);
      y = 800;
    }
    page.drawText(line, {
      x: margin,
      y,
      size: 10,
      font,
      color: rgb(0.2, 0.2, 0.25),
    });
    y -= lineHeight;
  }

  page.drawText("(PDF の詳細レイアウトはブラウザエンジン利用時に再現されます)", {
    x: margin,
    y: 40,
    size: 8,
    font,
    color: rgb(0.5, 0.5, 0.55),
  });

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars) {
      if (cur) lines.push(cur);
      cur = w.length > maxChars ? w.slice(0, maxChars) : w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}
