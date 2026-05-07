import Link from "next/link";
import { BottomNav } from "@/components/nav/bottom-nav";
import { getSessionFromCookies } from "@/lib/auth/session";
import { getAssignmentsForUser, getSitesForUser, getTasksForUser } from "@/lib/prototype-store";

export default async function WorkerHomePage() {
  const user = await getSessionFromCookies();
  if (!user) return null;

  const assignments = getAssignmentsForUser(user);
  const today = new Date().toISOString().slice(0, 10);
  const todayAssignment = assignments.find((item) => item.workDate === today);
  const site = getSitesForUser(user).find((item) => item.id === todayAssignment?.siteId);
  const tasks = getTasksForUser(user).filter((item) => item.siteId === todayAssignment?.siteId);

  return (
    <main className="space-y-4 p-4">
      <Link href="/m/worker/work/site" className="block rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h2 className="worker-readable text-xl">今日の現場</h2>
        {site ? (
          <>
            <p className="mt-2 text-2xl font-bold text-zinc-900">{site.name}</p>
            <p className="mt-1 text-base font-semibold text-zinc-800">
              集合 {todayAssignment?.shift === "night_full" ? "20:00" : "8:00"}
            </p>
          </>
        ) : (
          <p className="mt-2 text-base font-semibold text-zinc-800">今日は配置がありません</p>
        )}
      </Link>

      <Link href="/m/worker/work/tasks" className="block rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h2 className="worker-readable text-xl">業務内容</h2>
        <p className="mt-2 text-base font-semibold text-zinc-800">
          {tasks.length > 0
            ? `${tasks.length}件の業務があります。タップして内容を確認`
            : "本日の業務内容は未登録です"}
        </p>
      </Link>

      <Link href="/m/worker/reporting" className="block rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h2 className="worker-readable text-xl">報告・連絡</h2>
        <p className="mt-2 text-base font-semibold text-zinc-800">
          写真投稿（定例/進捗）とテキスト報告をカテゴリ別に送信
        </p>
      </Link>
      <BottomNav role="worker" />
    </main>
  );
}
