import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";

/**
 * メール送信スタブ（実装指示書 §1.10：送信機能のスタブで可）
 */
export async function POST(req: Request) {
  const user = await getSessionFromCookies();
  if (!user || (user.role !== "admin" && user.role !== "owner")) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  let body: { emails?: string[]; pdfUrl?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  return NextResponse.json({
    ok: true,
    stub: true,
    message:
      "メール送信はデモ用スタブです。Resend / SendGrid 等と接続する際はこの API を差し替えてください。",
    requested: body,
  });
}
