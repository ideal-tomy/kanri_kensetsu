import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";

/**
 * Web Push 購読の受け口（実装指示書 §2 のプッシュ通知）。
 * VAPID・ブラウザ Subscription を保存する実装はバックログとし、まずは契約を返す。
 */
export async function POST(req: Request) {
  const user = await getSessionFromCookies();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  return NextResponse.json({
    ok: true,
    stub: true,
    message:
      "購読を受け付けました（実送信・DB保存は VAPID 設定後に有効化）。メンション時はこのエンドポイントで登録した endpoint に通知します。",
    userId: user.id,
    received: body,
  });
}
