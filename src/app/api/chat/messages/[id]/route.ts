import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";
import { togglePin, toggleReaction } from "@/lib/chat/memory-store";
import { getSitesForUser } from "@/lib/prototype-store";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSessionFromCookies();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: { siteId?: string; emoji?: string; pin?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON が不正です" }, { status: 400 });
  }

  const siteId = body.siteId;
  if (!siteId) {
    return NextResponse.json({ error: "siteId が必要です" }, { status: 400 });
  }

  const allowed = getSitesForUser(user).some((s) => s.id === siteId);
  if (!allowed) {
    return NextResponse.json({ error: "この現場を開けません" }, { status: 403 });
  }

  if (body.emoji) {
    const m = toggleReaction(id, body.emoji, user.id);
    if (!m) return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    return NextResponse.json({ message: m });
  }

  if (body.pin === true || body.pin === false) {
    const r = togglePin(siteId, id);
    if (!r.ok) {
      const status = r.reason === "pin_limit" ? 409 : 404;
      const msg =
        r.reason === "pin_limit"
          ? "ピン留めは現場あたり最大5件です"
          : "見つかりません";
      return NextResponse.json({ error: msg }, { status });
    }
    return NextResponse.json({ message: r.message });
  }

  return NextResponse.json({ error: "emoji または pin を指定してください" }, { status: 400 });
}
