import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { updateSiteProgress } from "@/lib/prototype-store";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;
  if (!["supervisor", "admin", "owner"].includes(user.role)) {
    return NextResponse.json({ message: "この操作は監督以上のみです" }, { status: 403 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    progressTo?: number;
    userName?: string;
    comment?: string;
  };
  if (typeof body.progressTo !== "number" || Number.isNaN(body.progressTo)) {
    return NextResponse.json({ message: "進みぐあいの数値を入れてください" }, { status: 400 });
  }
  if (body.progressTo < 0 || body.progressTo > 100) {
    return NextResponse.json({ message: "進みぐあいは 0〜100 で入れてください" }, { status: 400 });
  }
  const result = updateSiteProgress(
    id,
    body.progressTo,
    body.userName?.trim() || user.name,
    body.comment,
  );
  if (!result) {
    return NextResponse.json({ message: "対象の現場が見つかりません" }, { status: 404 });
  }
  return NextResponse.json({ site: result.site, log: result.log });
}
