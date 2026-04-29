import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { projects } from "@/data/mock";

export default function ProjectsPage() {
  return (
    <PageShell
      mode="admin"
      title="現場案件一覧"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "現場案件一覧" },
      ]}
    >
      <div className="space-y-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/admin/projects/${project.id}`}
            className="block rounded-lg border border-zinc-200 bg-white p-4"
          >
            <p className="font-semibold text-zinc-900">{project.projectName}</p>
            <p className="text-sm text-zinc-600">
              {project.siteAddress} / {project.clientName}
            </p>
            <p className="text-sm text-zinc-600">ステータス: {project.status}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
