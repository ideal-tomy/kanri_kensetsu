import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { projects, workers } from "@/data/mock";

function statusLabel(status: string): string {
  switch (status) {
    case "assigned":
      return "担当中";
    case "available":
      return "待機・調整可";
    case "off":
      return "休み・不在";
    default:
      return status;
  }
}

export default function WorkersPage() {
  return (
    <PageShell
      mode="admin"
      title="作業員管理"
      subtitle="現場ごとの選定可否をタグで一目確認"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "作業員管理" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {workers.map((worker) => {
          const project = projects.find((p) => p.id === worker.currentProjectId);
          return (
            <Link
              key={worker.id}
              href={`/admin/workers/${worker.id}`}
              className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                担当現場
              </p>
              <h2 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-zinc-900">
                {project?.projectName ?? "現場未割当"}
              </h2>
              <p className="mt-2 border-t border-zinc-100 pt-2 text-sm font-semibold text-zinc-800">
                {worker.name}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-800">
                  経歴 {worker.yearsExperience}年
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                  現場責任者: {worker.siteLeadExperience}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    worker.status === "assigned"
                      ? "bg-blue-50 text-blue-800"
                      : worker.status === "available"
                        ? "bg-amber-50 text-amber-800"
                        : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {statusLabel(worker.status)}
                </span>
              </div>
              <p className="mt-2 text-xs font-medium text-zinc-500">保有資格</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {worker.qualificationTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs font-medium text-zinc-500">業務スキル</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {worker.skillTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
