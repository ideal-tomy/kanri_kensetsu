import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { blueprints, contractors, projects, workers } from "@/data/mock";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);
  if (!project) return notFound();

  const projectWorkers = workers.filter((w) => w.currentProjectId === id);
  const projectContractors = contractors.filter((c) =>
    c.activeProjectIds.includes(id),
  );
  const projectBlueprints = blueprints.filter((b) => b.projectId === id);

  return (
    <PageShell
      mode="admin"
      title={project.projectName}
      subtitle="案件詳細"
      listHref="/admin/projects"
      listLabel="案件一覧へ"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "現場案件", href: "/admin/projects" },
        { label: project.projectName },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold">協力会社</h2>
          <ul className="mt-2 text-sm text-zinc-700">
            {projectContractors.map((item) => (
              <li key={item.id}>{item.companyName}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold">現場社員</h2>
          <ul className="mt-2 text-sm text-zinc-700">
            {projectWorkers.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold">図面</h2>
          <ul className="mt-2 text-sm text-zinc-700">
            {projectBlueprints.map((item) => (
              <li key={item.id}>
                {item.title} ({item.revision})
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
