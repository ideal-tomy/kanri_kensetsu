import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { applyAssignmentChange } from "@/lib/prototype-store";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;
  if (!["supervisor", "admin", "owner"].includes(user.role)) {
    return NextResponse.json({ message: "この操作は監督以上のみです" }, { status: 403 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as { afterSiteName?: string; reason?: string };
  if (!body.afterSiteName?.trim()) {
    return NextResponse.json({ message: "移動先の現場名を入れてください" }, { status: 400 });
  }
  const change = applyAssignmentChange(id, body.afterSiteName, body.reason ?? "急ぎの応援");
  if (!change) {
    return NextResponse.json({ message: "対象が見つかりません" }, { status: 404 });
  }
  return NextResponse.json({ change });
}
