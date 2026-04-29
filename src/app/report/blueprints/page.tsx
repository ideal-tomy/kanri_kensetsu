import { PageShell } from "@/components/layout/page-shell";
import { blueprints, projects } from "@/data/mock";

export default function ReportBlueprintsPage() {
  return (
    <PageShell mode="report" title="図面確認" listHref="/report" listLabel="報告メニューへ">
      <div className="mx-auto max-w-md space-y-3">
        {blueprints.map((bp) => {
          const project = projects.find((p) => p.id === bp.projectId);
          return (
            <article key={bp.id} className="rounded-lg border border-zinc-200 bg-white p-4">
              <p className="font-semibold text-zinc-900">{bp.title}</p>
              <p className="text-sm text-zinc-600">{project?.projectName}</p>
              <p className="text-sm text-zinc-600">
                Rev {bp.revision} / 更新日 {bp.updatedAt}
              </p>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
