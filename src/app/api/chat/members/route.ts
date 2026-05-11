import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";
import { state, getSitesForUser } from "@/lib/prototype-store";

/** 現場にメンションできる名前の一覧（デモは配置からユニーク氏名を抽出） */
export async function GET(req: Request) {
  const user = await getSessionFromCookies();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const url = new URL(req.url);
  const siteId = url.searchParams.get("siteId");
  if (!siteId) {
    return NextResponse.json({ error: "siteId が必要です" }, { status: 400 });
  }

  const allowed = getSitesForUser(user).some((s) => s.id === siteId);
  if (!allowed) {
    return NextResponse.json({ error: "この現場を開けません" }, { status: 403 });
  }

  const names = new Set<string>();
  for (const a of state.assignments) {
    if (a.siteId === siteId) names.add(a.userName);
  }
  names.add("伊藤監督");
  names.add("山本監督");
  names.add("中村花子");

  return NextResponse.json({ members: Array.from(names).sort() });
}
