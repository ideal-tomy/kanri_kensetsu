import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { acknowledgeChange } from "@/lib/prototype-store";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;

  const { id } = await context.params;
  const body = (await request.json()) as { userName?: string };
  const change = acknowledgeChange(id, body.userName?.trim() || user.name);
  if (!change) {
    return NextResponse.json({ message: "対象が見つかりません" }, { status: 404 });
  }
  return NextResponse.json({ change });
}
