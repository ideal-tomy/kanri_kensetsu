import { BottomNav } from "@/components/nav/bottom-nav";
import { getViewSession } from "@/lib/auth/preview";
import { getAssignmentsForUser, getSitesForUser, getTasksForUser, state } from "@/lib/prototype-store";

function calcSchedulePct(startedAt?: string, endedAt?: string): number {
  if (!startedAt || !endedAt) return 0;
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
  const now = Date.now();
  if (end <= start) return 0;
  return Math.max(0, Math.min(100, Math.round(((now - start) / (end - start)) * 100)));
}

export default async function WorkerSiteDetailPage() {
  const { user } = await getViewSession("worker");
  if (!user) return null;

  const today = new Date().toISOString().slice(0, 10);
  const myAssignment = getAssignmentsForUser(user).find((item) => item.workDate === today);
  const site = getSitesForUser(user).find((item) => item.id === myAssignment?.siteId);
  const todayMembers = state.assignments.filter(
    (item) => item.siteId === myAssignment?.siteId && item.workDate === today,
  );
  const plannedPct = calcSchedulePct(site?.startedAt, site?.endedAt);
  const actualPct = site?.overallProgress ?? 0;
  const delay = actualPct < plannedPct ? plannedPct - actualPct : 0;
  const tasks = getTasksForUser(user).filter((item) => item.siteId === myAssignment?.siteId);

  return (
    <main className="space-y-4 p-4">
      <section className="rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h1 className="text-2xl font-bold text-zinc-900">今日の現場</h1>
        <p className="mt-2 text-2xl font-bold text-zinc-900">{site?.name ?? "未設定"}</p>
      </section>

      <section className="rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h2 className="text-xl font-bold text-zinc-900">今日のメンバー</h2>
        <ul className="mt-3 space-y-2">
          {todayMembers.map((member) => (
            <li key={member.id} className="rounded-lg border border-zinc-300 bg-zinc-50 p-3">
              <p className="text-base font-bold text-zinc-900">{member.userName}</p>
              <p className="text-sm font-semibold text-zinc-800">シフト: {member.shift}</p>
            </li>
          ))}
          {todayMembers.length === 0 ? (
            <li className="text-base font-semibold text-zinc-900">今日のメンバー情報はありません</li>
          ) : null}
        </ul>
      </section>

      <section className="rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h2 className="text-xl font-bold text-zinc-900">工程スケジュール</h2>
        <p className="mt-2 text-sm font-semibold text-zinc-800">
          着工 {site?.startedAt ?? "-"} / 完了予定 {site?.endedAt ?? "-"}
        </p>
        <div className="mt-3 h-5 w-full overflow-hidden rounded-full bg-zinc-200">
          <div className="h-full bg-blue-700" style={{ width: `${plannedPct}%` }} />
        </div>
        <p className="mt-2 text-sm font-bold text-zinc-900">計画進捗: {plannedPct}%</p>
      </section>

      <section className="rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h2 className="text-xl font-bold text-zinc-900">進捗状況</h2>
        <div className="mt-3 h-5 w-full overflow-hidden rounded-full bg-zinc-200">
          <div className="h-full bg-green-700" style={{ width: `${actualPct}%` }} />
        </div>
        <p className="mt-2 text-sm font-bold text-zinc-900">実績進捗: {actualPct}%</p>
        <p className="mt-1 text-sm font-semibold text-zinc-900">
          {delay > 0 ? `計画より ${delay}% 遅れ` : "計画どおり"}
        </p>
      </section>

      <section className="rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h2 className="text-xl font-bold text-zinc-900">本日の主要業務</h2>
        <ul className="mt-2 space-y-2">
          {tasks.slice(0, 3).map((task) => (
            <li key={task.id} className="rounded-lg bg-zinc-50 p-3 text-base font-bold text-zinc-900">
              {task.title}
            </li>
          ))}
        </ul>
      </section>
      <BottomNav role="worker" />
    </main>
  );
}
