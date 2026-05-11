import { NextResponse } from "next/server";
import { buildBoardSummary, buildWorkerPayload } from "@/lib/demo/exterior-sash-aggregator";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") ?? "board";
  const siteId = searchParams.get("siteId");

  if (view === "worker") {
    if (!siteId) {
      return NextResponse.json({ message: "siteId が必要です" }, { status: 400 });
    }
    const worker = buildWorkerPayload(siteId);
    if (!worker) {
      return NextResponse.json({ message: "現場が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ worker });
  }

  if (view === "board") {
    return NextResponse.json(buildBoardSummary());
  }

  return NextResponse.json({ message: "view は board または worker を指定してください" }, { status: 400 });
}
