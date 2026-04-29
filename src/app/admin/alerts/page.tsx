import { PageShell } from "@/components/layout/page-shell";
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
      <div className="space-y-3">
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
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-zinc-600">{project?.projectName}</p>
              <p className="text-sm text-zinc-700">{item.message}</p>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
