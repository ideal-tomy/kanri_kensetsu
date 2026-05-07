import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { getAssignmentsForUser } from "@/lib/prototype-store";

export async function GET(request: Request) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;
  return NextResponse.json({ assignments: getAssignmentsForUser(user) });
}
