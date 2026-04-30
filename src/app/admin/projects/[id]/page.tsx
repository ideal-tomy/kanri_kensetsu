import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { blueprints, contractors, projects, scheduleTasks, workers } from "@/data/mock";

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
  const tasks = scheduleTasks.filter((t) => t.projectId === id);

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
      <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex gap-2 text-primary">
          <MapPin className="h-5 w-5 shrink-0" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-zinc-900">現場住所</p>
            <p className="text-sm text-zinc-700">{project.siteAddress}</p>
            <p className="mt-1 text-xs text-zinc-500">
              発注: {project.clientName} ／ コード: {project.projectCode}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-zinc-900">工程スケジュール（デモ）</h2>
        <p className="mt-1 text-sm text-zinc-600">
          ガント風の進捗バー。実データ連携はしていません。
        </p>
        <div className="mt-4 rounded-md border border-zinc-100 bg-zinc-50 p-3">
          <div className="relative flex h-14 w-full overflow-hidden rounded bg-zinc-200">
            {tasks.map((t) => (
              <div
                key={t.id}
                title={t.label}
                className={`absolute top-2 flex h-10 items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded px-1 text-xs font-medium text-white ${
                  t.status === "done"
                    ? "bg-emerald-600"
                    : t.status === "in_progress"
                      ? "bg-primary"
                      : "bg-zinc-500"
                }`}
                style={{
                  left: `${t.startOffsetPercent}%`,
                  width: `${t.widthPercent}%`,
                }}
              >
                <span className="truncate px-1">{t.label}</span>
              </div>
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-600">
            <li>
              <span className="inline-block h-2 w-4 rounded bg-emerald-600 align-middle" />{" "}
              完了
            </li>
            <li>
              <span className="inline-block h-2 w-4 rounded bg-primary align-middle" />{" "}
              進行中
            </li>
            <li>
              <span className="inline-block h-2 w-4 rounded bg-zinc-500 align-middle" />{" "}
              未着手
            </li>
          </ul>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold">協力会社</h2>
          <ul className="mt-2 text-sm text-zinc-700">
            {projectContractors.map((item) => (
              <li key={item.id}>{item.companyName}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold">現場社員</h2>
          <ul className="mt-2 text-sm text-zinc-700">
            {projectWorkers.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
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
