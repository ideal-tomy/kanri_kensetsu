import { NextResponse } from "next/server";
import { parseReport } from "@/lib/parser/report";

export async function POST(request: Request) {
  const body = (await request.json()) as { rawText?: string };
  if (!body.rawText?.trim()) {
    return NextResponse.json({ message: "話した内容を入れてください" }, { status: 400 });
  }
  return NextResponse.json({ parsed: parseReport(body.rawText) });
}
