import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { assignments, projects, workers } from "@/data/mock";

export default function AssignmentsPage() {
  return (
    <PageShell
      mode="admin"
      title="配員最適化"
      subtitle="AIスコア・配置アラーム・履歴照合（デモ）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "配員最適化" },
      ]}
    >
      <DemoDisclaimer variant="banner" context="dispatch" />

      <div className="mt-6 space-y-4">
        {assignments.map((item) => {
          const project = projects.find((p) => p.id === item.projectId);
          const worker = workers.find((w) => w.id === item.workerId);
          const alarm = item.dispatchAlarmLevel && item.dispatchAlarmLevel !== "none";

          return (
            <div
              key={item.id}
              className={`rounded-lg border p-4 ${
                alarm
                  ? "border-amber-300 bg-amber-50/90"
                  : "border-zinc-200 bg-white"
              }`}
            >
              {alarm ? (
                <div className="mb-3 flex items-start gap-2 rounded-md border border-amber-200 bg-white/80 p-3 text-sm text-amber-950">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
                  <div>
                    <p className="font-semibold">配置アラーム</p>
                    <p className="mt-1 text-xs text-amber-900">
                      ルール: {item.alarmRuleLabel ?? "（参照）"}
                      {item.linkedIncidentNoteId ? (
                        <>
                          {" "}
                          ／ 履歴ID:{" "}
                          <code className="rounded bg-amber-100 px-1">{item.linkedIncidentNoteId}</code>
                        </>
                      ) : null}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">{item.alarmEvidence}</p>
                  </div>
                </div>
              ) : null}

              <p className="font-semibold text-zinc-900">
                {worker?.name} → {project?.projectName}
              </p>
              <p className="text-sm text-zinc-600">
                {item.date} ／ {item.shift === "day" ? "日勤" : "夜勤"} ／ 状態:{" "}
                {item.assignmentStatus}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                AIスコア: {item.aiScore ?? "-"} ／ {item.aiReason ?? "手動設定"}
              </p>
              {item.manualOverrideReason ? (
                <p className="mt-2 text-sm text-amber-800">
                  手動上書き: {item.manualOverrideReason}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <Link
                  href={`/admin/workers/${item.workerId}`}
                  className="font-medium text-primary underline"
                >
                  作業員詳細（トラブル履歴）
                </Link>
                <Link href="/admin/alerts" className="font-medium text-primary underline">
                  アラート一覧
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
