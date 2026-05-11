import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { state } from "@/lib/prototype-store";
import { togglePhaseAction, setPhasePercentAction } from "./actions";

export default async function SitePhasesPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId: raw } = await params;
  const siteId = decodeURIComponent(raw);
  const site = state.sites.find((s) => s.id === siteId);
  if (!site) notFound();

  const phases = state.phases
    .filter((p) => p.siteId === siteId)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const tasks = state.tasks.filter((t) => t.siteId === siteId);

  return (
    <PageShell
      mode="admin"
      title={`工程管理：${site.name}`}
      subtitle="工程・タスクの進捗（デモはインメモリ。進捗写真は photo_count タスクに +1）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "現場管理", href: "/admin/sites" },
        { label: site.name },
        { label: "工程" },
      ]}
    >
      <p className="text-sm text-zinc-600">
        全体進捗: <strong>{site.overallProgress}%</strong>（各工程の平均に同期）
      </p>

      <ul className="mt-6 space-y-4">
        {phases.map((p) => {
          const pTasks = tasks.filter((t) => t.phaseId === p.id);
          return (
            <li
              key={p.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-zinc-500">工程</p>
                  <h2 className="text-lg font-bold text-zinc-900">{p.name}</h2>
                  <p className="text-xs text-zinc-500">
                    予定: {p.plannedStartDate} 〜 {p.plannedEndDate}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: p.color ?? "#ea580c" }}
                  >
                    {p.progressPct}%
                  </p>
                  <p className="text-xs text-zinc-500">
                    モード: {p.progressMode === "auto" ? "自動" : "手動"}
                  </p>
                </div>
              </div>

              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${p.progressPct}%`,
                    backgroundColor: p.color ?? "#ea580c",
                  }}
                />
              </div>

              <ul className="mt-3 space-y-1 text-sm text-zinc-800">
                {pTasks.map((t) => (
                  <li key={t.id} className="flex flex-wrap justify-between gap-2">
                    <span>
                      {t.title}
                      {t.autoProgressSource === "photo_count" ? (
                        <span className="ml-2 text-xs text-emerald-700">（写真で自動+1）</span>
                      ) : null}
                    </span>
                    <span className="text-zinc-600">
                      {t.plannedQty != null
                        ? `${t.actualQty}/${t.plannedQty} ${t.unit ?? ""} · ${t.progressPct}%`
                        : `${t.progressPct}%`}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                <form action={togglePhaseAction}>
                  <input type="hidden" name="phaseId" value={p.id} />
                  <input type="hidden" name="siteId" value={siteId} />
                  <button
                    type="submit"
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900"
                  >
                    自動／手動を切替
                  </button>
                </form>
                <form action={setPhasePercentAction} className="flex items-center gap-2">
                  <input type="hidden" name="phaseId" value={p.id} />
                  <input type="hidden" name="siteId" value={siteId} />
                  <input
                    name="pct"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={p.progressPct}
                    className="w-20 rounded border border-zinc-300 px-2 py-1 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white"
                  >
                    手動％で上書き
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-center text-sm">
        <Link href="/admin/sites" className="text-primary underline">
          現場一覧へ
        </Link>
      </p>
    </PageShell>
  );
}
