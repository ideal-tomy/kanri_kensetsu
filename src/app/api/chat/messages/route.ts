import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";
import {
  addMessage,
  getMessagesForSite,
  markRead,
} from "@/lib/chat/memory-store";
import { getSitesForUser } from "@/lib/prototype-store";

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

  markRead(siteId, user.id);
  const messages = getMessagesForSite(siteId);
  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  const user = await getSessionFromCookies();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  let body: {
    siteId?: string;
    body?: string | null;
    attachments?: { type: string; url: string; name?: string }[];
  };
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

  const msg = addMessage({
    siteId,
    user,
    body: body.body ?? "",
    message_type: body.attachments?.length ? "photo" : "text",
    attachments: body.attachments,
  });

  if ((body.body ?? "").includes("@")) {
    // メンション検知 — 本番では push_subscriptions + Web Push
    console.info("[chat] mention stub — integrate web-push + subscriptions table");
  }

  return NextResponse.json({ message: msg });
}
