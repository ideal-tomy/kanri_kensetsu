import { BottomNav } from "@/components/nav/bottom-nav";
import { getViewSession } from "@/lib/auth/preview";
import { getAssignmentsForUser, getTasksForUser } from "@/lib/prototype-store";

export default async function WorkerTaskNormaPage() {
  const { user } = await getViewSession("worker");
  if (!user) return null;

  const today = new Date().toISOString().slice(0, 10);
  const myAssignment = getAssignmentsForUser(user).find((item) => item.workDate === today);
  const tasks = getTasksForUser(user).filter((item) => item.siteId === myAssignment?.siteId);

  const totals = tasks.reduce(
    (acc, task) => {
      const minimum = task.todayTargetQty ?? Math.max(1, Math.round((task.plannedQty ?? 1) * 0.3));
      acc.minimum += minimum;
      acc.actual += task.actualQty;
      return acc;
    },
    { minimum: 0, actual: 0 },
  );
  const normaPct = totals.minimum > 0 ? Math.min(100, Math.round((totals.actual / totals.minimum) * 100)) : 0;

  return (
    <main className="space-y-4 p-4">
      <section className="rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h1 className="text-2xl font-bold text-zinc-900">業務内容（本日ノルマ）</h1>
        <p className="mt-2 text-base font-bold text-zinc-900">
          最低ノルマ {totals.minimum}
          {tasks[0]?.unit ?? ""} / 実績 {totals.actual}
          {tasks[0]?.unit ?? ""}
        </p>
        <div className="mt-3 h-5 w-full overflow-hidden rounded-full bg-zinc-200">
          <div className="h-full bg-orange-600" style={{ width: `${normaPct}%` }} />
        </div>
        <p className="mt-2 text-base font-bold text-zinc-900">ノルマ達成率 {normaPct}%</p>
      </section>

      <section className="space-y-3">
        {tasks
          .map((task) => {
            const minimum = task.todayTargetQty ?? Math.max(1, Math.round((task.plannedQty ?? 1) * 0.3));
            const remain = Math.max(0, minimum - task.actualQty);
            const pct = Math.min(100, Math.round((task.actualQty / minimum) * 100));
            return { ...task, minimum, remain, pct };
          })
          .sort((a, b) => b.remain - a.remain)
          .map((task) => (
            <article key={task.id} className="rounded-xl border-2 border-zinc-300 bg-white p-4">
              <h2 className="text-xl font-bold text-zinc-900">{task.title}</h2>
              <p className="mt-1 text-base font-semibold text-zinc-900">
                目標 {task.minimum}
                {task.unit ?? ""} / 実績 {task.actualQty}
                {task.unit ?? ""} / 残り {task.remain}
                {task.unit ?? ""}
              </p>
              <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-zinc-200">
                <div className="h-full bg-indigo-700" style={{ width: `${task.pct}%` }} />
              </div>
              <p className="mt-1 text-sm font-bold text-zinc-900">最低ノルマライン達成率 {task.pct}%</p>
            </article>
          ))}
      </section>
      <BottomNav role="worker" />
    </main>
  );
}
