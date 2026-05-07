import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export type AppRole = "worker" | "supervisor" | "admin" | "owner";

export type SessionUser = {
  id: string;
  name: string;
  companyCode: string;
  role: AppRole;
};

export const SESSION_COOKIE = "genba_session";

export function getDefaultPathForRole(role: AppRole): string {
  switch (role) {
    case "worker":
      return "/m/worker";
    case "supervisor":
      return "/m/supervisor";
    case "admin":
    case "owner":
      return "/admin";
    default:
      return "/login";
  }
}

function parseSession(raw: string | undefined): SessionUser | null {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded) as SessionUser;
    if (!parsed?.id || !parsed?.name || !parsed?.companyCode || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function encodeSession(user: SessionUser): string {
  return JSON.stringify(user);
}

export function getSessionFromRequest(req: NextRequest | Request): SessionUser | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const token = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  return parseSession(token);
}

export async function getSessionFromCookies(): Promise<SessionUser | null> {
  const jar = await cookies();
  return parseSession(jar.get(SESSION_COOKIE)?.value);
}
