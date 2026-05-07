import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getDefaultPathForRole, getSessionFromRequest } from "@/lib/auth/session";

const PUBLIC_PATHS = ["/login", "/join", "/api/auth"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json"
  ) {
    return NextResponse.next();
  }

  const user = getSessionFromRequest(req);
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && !["admin", "owner"].includes(user.role)) {
    return NextResponse.redirect(new URL(getDefaultPathForRole(user.role), req.url));
  }

  if (pathname.startsWith("/m/supervisor") && !["supervisor", "admin", "owner"].includes(user.role)) {
    return NextResponse.redirect(new URL("/m/worker", req.url));
  }

  if (pathname.startsWith("/m/worker") && ["admin", "owner"].includes(user.role)) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icons).*)"],
};
