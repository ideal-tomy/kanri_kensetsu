import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { BottomNav } from "@/components/nav/bottom-nav";
import { blueprints, projects } from "@/data/mock";

export default function WorkerBlueprintsPage() {
  return (
    <main className="space-y-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-zinc-900">
          <BookOpen className="h-6 w-6 text-primary" aria-hidden />
          図面確認
        </h1>
        <Link
          href="/m/worker"
          className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-bold text-zinc-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          もどる
        </Link>
      </div>

      <p className="text-base font-semibold text-zinc-800">
        最新版の図面と改訂履歴を確認できます。タップでプレビュー（デモ）。
      </p>

      <section className="space-y-3">
        {blueprints.map((bp) => {
          const project = projects.find((p) => p.id === bp.projectId);
          return (
            <article
              key={bp.id}
              className="rounded-xl border-2 border-zinc-300 bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                  <BookOpen className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-zinc-900">{bp.title}</p>
                  {project ? (
                    <p className="text-sm font-semibold text-zinc-700">{project.projectName}</p>
                  ) : null}
                  <p className="mt-1 text-sm font-semibold text-zinc-600">
                    Rev {bp.revision} / 更新日 {bp.updatedAt}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
        {blueprints.length === 0 ? (
          <p className="text-base font-semibold text-zinc-700">登録された図面はありません</p>
        ) : null}
      </section>

      <BottomNav role="worker" />
    </main>
  );
}
