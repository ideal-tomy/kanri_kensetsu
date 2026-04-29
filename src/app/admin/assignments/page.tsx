import { PageShell } from "@/components/layout/page-shell";
import { assignments, projects, workers } from "@/data/mock";

export default function AssignmentsPage() {
  return (
    <PageShell
      mode="admin"
      title="配員最適化"
      subtitle="AIスコアと理由を表示"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "配員最適化" },
      ]}
    >
      <div className="space-y-3">
        {assignments.map((item) => {
          const project = projects.find((p) => p.id === item.projectId);
          const worker = workers.find((w) => w.id === item.workerId);
          return (
            <div key={item.id} className="rounded-lg border border-zinc-200 bg-white p-4">
              <p className="font-semibold text-zinc-900">
                {worker?.name} → {project?.projectName}
              </p>
              <p className="text-sm text-zinc-600">
                AIスコア: {item.aiScore ?? "-"} / 理由: {item.aiReason ?? "手動設定"}
              </p>
              {item.manualOverrideReason ? (
                <p className="mt-1 text-sm text-orange-700">
                  手動上書き: {item.manualOverrideReason}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
