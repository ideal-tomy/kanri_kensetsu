import { BookOpen, Search, Tag } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { StatCard } from "@/components/viz/StatCard";
import { knowledgeItems } from "@/data/mock";

export default function KnowledgePage() {
  const total = knowledgeItems.length;
  const tags = Array.from(new Set(knowledgeItems.map((i) => i.category)));

  return (
    <PageShell
      mode="admin"
      title="社内ナレッジ"
      subtitle="手順・FAQ・チェックリスト"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "社内ナレッジ" },
      ]}
    >
      <section className="grid gap-3 md:grid-cols-3">
        <StatCard
          label="登録ナレッジ"
          value={total}
          unit="件"
          icon={BookOpen}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="カテゴリ数"
          value={tags.length}
          unit="種"
          icon={Tag}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
        />
        <StatCard
          label="検索可能"
          value={total}
          unit="件"
          icon={Search}
          hint="全文検索デモ（準備中）"
        />
      </section>

      <section className="mt-6">
        <ChartCard title="検索 & フィルタ">
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                type="search"
                placeholder="例：建具 傷防止 / KY"
                className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                disabled
              />
              <span className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                準備中
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </ChartCard>
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {knowledgeItems.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-800">
              {item.category}
            </span>
            <h3 className="mt-2 text-base font-bold text-zinc-900">{item.title}</h3>
            <p className="mt-1 text-sm text-zinc-600">{item.summary}</p>
            <p className="mt-3 text-xs text-zinc-400">更新 {item.updatedAt}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
