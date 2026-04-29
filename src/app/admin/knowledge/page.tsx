import { PageShell } from "@/components/layout/page-shell";
import { knowledgeItems } from "@/data/mock";

export default function KnowledgePage() {
  return (
    <PageShell
      mode="admin"
      title="社内ナレッジ"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "社内ナレッジ" },
      ]}
    >
      <div className="space-y-3">
        {knowledgeItems.map((item) => (
          <article key={item.id} className="rounded-lg border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">{item.category}</p>
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-sm text-zinc-600">{item.summary}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
