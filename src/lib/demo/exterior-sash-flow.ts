/**
 * 現場員デモ用：当日の作業ステップ（到着〜完了）
 * サーバー単体実行でも保持したいのでモジュールスコープ Map を使用。
 */

export type ExteriorSashFlowStep = "idle" | "arrived" | "working" | "completed";

const flowBySite = new Map<string, ExteriorSashFlowStep>();

export function getExteriorSashFlow(siteId: string): ExteriorSashFlowStep {
  return flowBySite.get(siteId) ?? "idle";
}

export function setExteriorSashFlow(siteId: string, step: ExteriorSashFlowStep) {
  flowBySite.set(siteId, step);
}
