import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";
import { buildThreadPreviews } from "@/lib/chat/memory-store";
import { getSitesForUser } from "@/lib/prototype-store";

export async function GET() {
  const user = await getSessionFromCookies();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const sites = getSitesForUser(user);
  const threads = buildThreadPreviews(
    sites.map((s) => ({ id: s.id, name: s.name })),
    user,
  );

  return NextResponse.json({ threads });
}
