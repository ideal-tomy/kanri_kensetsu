import { NextResponse } from "next/server";
import { getExteriorSashConfig } from "@/lib/demo/exterior-sash-rules";
import { setExteriorSashFlow, type ExteriorSashFlowStep } from "@/lib/demo/exterior-sash-flow";

const ALLOWED: ExteriorSashFlowStep[] = ["idle", "arrived", "working", "completed"];

export async function POST(request: Request) {
  const body = (await request.json()) as { siteId?: string; step?: string };

  if (!body.siteId?.trim()) {
    return NextResponse.json({ message: "現場を指定してください" }, { status: 400 });
  }
  if (!body.step || !ALLOWED.includes(body.step as ExteriorSashFlowStep)) {
    return NextResponse.json({ message: "step が不正です" }, { status: 400 });
  }

  const cfg = getExteriorSashConfig(body.siteId.trim());
  if (!cfg) {
    return NextResponse.json({ message: "この現場は外壁サッシデモ対象外です" }, { status: 400 });
  }

  setExteriorSashFlow(body.siteId.trim(), body.step as ExteriorSashFlowStep);

  return NextResponse.json({ ok: true, siteId: body.siteId.trim(), step: body.step });
}
