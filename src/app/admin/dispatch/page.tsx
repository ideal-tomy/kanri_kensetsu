import { PageShell } from "@/components/layout/page-shell";
import { dispatchProgresses, projects } from "@/data/mock";

export default function DispatchPage() {
  return (
    <PageShell
      mode="admin"
      title="現場手配進捗"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "現場手配進捗" },
      ]}
    >
      <div className="space-y-3">
        {dispatchProgresses.map((item) => {
          const project = projects.find((p) => p.id === item.projectId);
          const isFollow = item.status === "follow_required";
          return (
            <div
              key={item.id}
              className={`rounded-lg border p-4 ${
                isFollow
                  ? "border-orange-200 bg-orange-50"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <p className="font-semibold">{project?.projectName}</p>
              <p className="text-sm text-zinc-600">
                区分: {item.category} / 状態: {item.status} / 期限: {item.dueDate}
              </p>
              {isFollow ? <p className="text-sm text-orange-700">要フォロー案件</p> : null}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
