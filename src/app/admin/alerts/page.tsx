import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { alertNotifications, projects } from "@/data/mock";

export default function AlertsPage() {
  return (
    <PageShell
      mode="admin"
      title="連携・アラート"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "連携・アラート" },
      ]}
    >
      <DemoDisclaimer variant="banner" context="ai" />

      <div className="mt-6 space-y-4">
        {alertNotifications.map((item) => {
          const project = projects.find((p) => p.id === item.projectId);
          return (
            <div
              key={item.id}
              className={`rounded-lg border p-4 ${
                item.level === "critical"
                  ? "border-red-200 bg-red-50"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-zinc-900">{item.title}</p>
                {item.source ? (
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      item.source === "ai"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {item.source === "ai" ? "AI" : "手動"}
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-zinc-600">{project?.projectName}</p>
              <p className="mt-2 text-sm text-zinc-800">{item.message}</p>

              {item.aiEvidence ? (
                <div className="mt-3 rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-950">
                  <p className="font-semibold text-sky-900">AI参照根拠（デモ）</p>
                  <p className="mt-1 text-xs text-sky-800">
                    ルール: {item.aiEvidence.ruleLabel}
                    {item.aiEvidence.incidentNoteId ? (
                      <>
                        {" "}
                        ／ メモID: {item.aiEvidence.incidentNoteId}
                      </>
                    ) : null}
                  </p>
                  {item.aiEvidence.matchedKeywords?.length ? (
                    <p className="mt-1 text-xs text-sky-800">
                      キーワード: {item.aiEvidence.matchedKeywords.join("、")}
                    </p>
                  ) : null}
                  <p className="mt-2 leading-relaxed">{item.aiEvidence.detail}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
