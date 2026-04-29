import { PageShell } from "@/components/layout/page-shell";
import { projects, safetyDocuments } from "@/data/mock";

export default function SafetyDocsPage() {
  return (
    <PageShell
      mode="admin"
      title="安全書類"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "安全書類" },
      ]}
    >
      <div className="space-y-3">
        {safetyDocuments.map((doc) => {
          const project = projects.find((p) => p.id === doc.projectId);
          return (
            <div key={doc.id} className="rounded-lg border border-zinc-200 bg-white p-4">
              <p className="font-semibold">{doc.docType}</p>
              <p className="text-sm text-zinc-600">{project?.projectName}</p>
              <p className="text-sm text-zinc-600">
                状態: {doc.status} / 期限: {doc.requiredByDate}
              </p>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
