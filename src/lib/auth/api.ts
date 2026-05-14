import { NextResponse } from "next/server";
import { resolveApiUserFromRequest } from "@/lib/auth/preview";
import { getSessionFromRequest, type SessionUser } from "@/lib/auth/session";

export function requireSession(request: Request): SessionUser | NextResponse {
  const user = getSessionFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "ログインしてください" }, { status: 401 });
  }
  return resolveApiUserFromRequest(request, user);
}
