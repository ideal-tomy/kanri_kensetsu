import { BottomNav } from "@/components/nav/bottom-nav";
import { getViewSession } from "@/lib/auth/preview";
import { getSitesForUser, getTasksForUser } from "@/lib/prototype-store";

export default async function SupervisorHomePage() {
  const { user } = await getViewSession("supervisor");
  if (!user) return null;
  const sites = getSitesForUser(user);
  const tasks = getTasksForUser(user);

  return (
    <main className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-zinc-900">本日の担当現場</h1>
      <section className="space-y-2">
        {sites.map((site) => {
          const siteTasks = tasks.filter((task) => task.siteId === site.id);
          return (
            <article key={site.id} className="rounded-xl border border-zinc-200 bg-white p-4">
              <h2 className="text-lg font-bold">{site.name}</h2>
              <p className="text-sm font-semibold text-zinc-700">
                進行中 {siteTasks.filter((t) => t.status === "in_progress").length} 件
              </p>
            </article>
          );
        })}
      </section>
      <BottomNav role="supervisor" />
    </main>
  );
}
