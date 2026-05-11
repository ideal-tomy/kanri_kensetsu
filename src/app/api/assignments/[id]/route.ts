import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import {
  updateAssignment,
  type AssignmentUpdatePatch,
  type AssignmentStatus,
  type ShiftType,
} from "@/lib/prototype-store";

const SHIFTS: ShiftType[] = [
  "day_full",
  "day_am",
  "day_pm",
  "night_full",
  "night_early",
  "night_late",
];

const STATUSES: AssignmentStatus[] = ["planned", "confirmed", "changed", "cancelled"];

const YMD = /^\d{4}-\d{2}-\d{2}$/;

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
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "JSON が不正です" }, { status: 400 });
  }

  const patch: AssignmentUpdatePatch = {};

  if (typeof body.siteId === "string" && body.siteId.trim()) {
    patch.siteId = body.siteId.trim();
  }
  if (typeof body.shift === "string") {
    if (!SHIFTS.includes(body.shift as ShiftType)) {
      return NextResponse.json({ message: "シフトが不正です" }, { status: 400 });
    }
    patch.shift = body.shift as ShiftType;
  }
  if (typeof body.workDate === "string") {
    const wd = body.workDate.trim();
    if (!YMD.test(wd)) {
      return NextResponse.json({ message: "日付は YYYY-MM-DD で指定してください" }, { status: 400 });
    }
    patch.workDate = wd;
  }
  if (typeof body.status === "string") {
    if (!STATUSES.includes(body.status as AssignmentStatus)) {
      return NextResponse.json({ message: "ステータスが不正です" }, { status: 400 });
    }
    patch.status = body.status as AssignmentStatus;
  }
  if (typeof body.reason === "string") {
    patch.reason = body.reason.trim() || undefined;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ message: "更新項目がありません" }, { status: 400 });
  }

  const result = updateAssignment(id, patch);
  if (!result) {
    return NextResponse.json({ message: "対象が見つかりません" }, { status: 404 });
  }

  return NextResponse.json({
    assignment: result.assignment,
    siteChange: result.siteChange,
  });
}
