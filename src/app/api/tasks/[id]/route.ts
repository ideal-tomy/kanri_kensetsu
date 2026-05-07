import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import {
  addTaskQuantity,
  setTaskInterruption,
  state,
  updateTask,
  type TaskStatus,
  type PauseReason,
} from "@/lib/prototype-store";

const VALID_STATUS: TaskStatus[] = ["not_started", "in_progress", "paused", "completed"];
const VALID_REASON: PauseReason[] = ["rain", "material", "manpower", "other"];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;

  const { id } = await context.params;
  const body = (await request.json()) as {
    status?: TaskStatus;
    progressPct?: number;
    qtyDelta?: number;
    pausedReason?: PauseReason;
    userName?: string;
  };

  const userName = body.userName?.trim() || user.name;

  // 出来高加算が来たらそれを最優先で処理
  if (typeof body.qtyDelta === "number" && body.qtyDelta !== 0) {
    if (user.role === "worker" && body.qtyDelta < 0) {
      return NextResponse.json({ message: "職人はマイナス補正できません" }, { status: 403 });
    }
    const task = addTaskQuantity(id, body.qtyDelta, userName);
    if (!task) {
      return NextResponse.json({ message: "対象が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ task });
  }

  // 中断（理由つき）
  if (body.status === "paused" && body.pausedReason) {
    if (!VALID_REASON.includes(body.pausedReason)) {
      return NextResponse.json({ message: "とまった理由を正しく選んでください" }, { status: 400 });
    }
    const task = setTaskInterruption(id, body.pausedReason, userName);
    if (!task) {
      return NextResponse.json({ message: "対象が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ task });
  }

  // ステータス単独変更（progressPctは省略可）
  if (body.status) {
    if (user.role === "worker" && body.status === "completed") {
      return NextResponse.json({ message: "完了は監督が確定します" }, { status: 403 });
    }
    if (!VALID_STATUS.includes(body.status)) {
      return NextResponse.json({ message: "じょうたいが正しくありません" }, { status: 400 });
    }
    const current = state.tasks.find((t) => t.id === id);
    if (!current) {
      return NextResponse.json({ message: "対象が見つかりません" }, { status: 404 });
    }
    const nextProgress =
      typeof body.progressPct === "number"
        ? body.progressPct
        : body.status === "completed"
          ? 100
          : body.status === "in_progress"
            ? Math.max(current.progressPct, 25)
            : current.progressPct;
    const task = updateTask(id, body.status, nextProgress);
    if (!task) {
      return NextResponse.json({ message: "対象が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ task });
  }

  return NextResponse.json(
    { message: "じょうたいか出来高（qtyDelta）を入れてください" },
    { status: 400 },
  );
}
