import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { createReport, getReportsForUser } from "@/lib/prototype-store";

export async function GET(request: Request) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;
  return NextResponse.json({ reports: getReportsForUser(user) });
}

export async function POST(request: Request) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;

  const body = (await request.json()) as {
    siteId?: string;
    rawText?: string;
  };
  if (!body.siteId) {
    return NextResponse.json({ message: "現場を選んでください" }, { status: 400 });
  }
  if (!body.rawText?.trim()) {
    return NextResponse.json({ message: "話した内容を入れてください" }, { status: 400 });
  }
  const report = createReport(body.siteId, user.name, body.rawText);
  return NextResponse.json({ report });
}
