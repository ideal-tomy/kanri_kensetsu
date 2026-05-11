import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { state, updateAssignment } from "@/lib/prototype-store";

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
  const afterName = body.afterSiteName?.trim() ?? "";
  if (!afterName) {
    return NextResponse.json({ message: "移動先の現場名を入れてください" }, { status: 400 });
  }

  const site = state.sites.find((s) => s.name === afterName);
  if (!site) {
    return NextResponse.json({ message: "移動先の現場が見つかりません" }, { status: 400 });
  }

  const result = updateAssignment(id, {
    siteId: site.id,
    reason: body.reason ?? "急ぎの応援",
  });
  if (!result) {
    return NextResponse.json({ message: "対象が見つかりません" }, { status: 404 });
  }
  return NextResponse.json({ change: result.siteChange });
}
