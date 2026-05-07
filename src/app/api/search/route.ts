import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { state } from "@/lib/prototype-store";
import { PAUSE_REASON_LABEL } from "@/lib/copy";

const REASON_KEYWORDS: Record<keyof typeof PAUSE_REASON_LABEL, string[]> = {
  rain: ["雨", "雨天"],
  material: ["材料", "資材"],
  manpower: ["人手", "人員"],
  other: ["そのほか", "その他"],
};

export async function GET(request: Request) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;
  if (user.role === "worker") {
    return NextResponse.json({ results: [] });
  }

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  if (!q) return NextResponse.json({ results: [] });

  const reportResults = state.reports
    .filter((item) => item.rawText.toLowerCase().includes(q))
    .map((item) => ({
      id: item.id,
      type: "report",
      title: `${item.authorName} さんの日報`,
      text: item.rawText,
      createdAt: item.createdAt,
    }));

  const taskResults = state.tasks
    .filter((item) => {
      const lower = item.title.toLowerCase();
      if (lower.includes(q)) return true;
      if (q.includes("中断") && item.status === "paused") return true;
      if (item.pausedReason) {
        const keys = REASON_KEYWORDS[item.pausedReason] ?? [];
        if (keys.some((k) => q.includes(k))) return true;
      }
      return false;
    })
    .map((item) => {
      const qty = item.plannedQty != null
        ? `${item.actualQty}/${item.plannedQty}${item.unit ?? ""}（${item.progressPct}%）`
        : `${item.progressPct}%`;
      const reasonText = item.pausedReason
        ? `／とまってる理由：${PAUSE_REASON_LABEL[item.pausedReason]}`
        : "";
      return {
        id: item.id,
        type: "task",
        title: item.title,
        text: `進みぐあい ${qty}${reasonText}`,
        createdAt: item.updatedAt,
      };
    });

  return NextResponse.json({ results: [...reportResults, ...taskResults] });
}
