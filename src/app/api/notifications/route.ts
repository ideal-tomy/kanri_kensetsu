import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { state } from "@/lib/prototype-store";

export async function GET(request: Request) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;
  if (user.role === "admin" || user.role === "owner") {
    return NextResponse.json({ notifications: state.notifications });
  }
  return NextResponse.json({
    notifications: state.notifications.filter((item) => item.userName === user.name),
  });
}
