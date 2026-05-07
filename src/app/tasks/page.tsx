import { BottomNav } from "@/components/nav/bottom-nav";
import { TasksBoard } from "@/components/task/tasks-board";
import { OverallProgressCard } from "@/components/site/overall-progress-card";
import { state } from "@/lib/prototype-store";

export default function TasksPage() {
  return (
    <main className="min-h-screen bg-zinc-100 p-4 pb-24">
      <div className="mx-auto max-w-3xl space-y-4">
        <section className="space-y-3">
          {state.sites.map((site) => (
            <div key={site.id} className="space-y-2">
              <p className="px-1 text-sm font-bold text-zinc-700">{site.name}</p>
              <OverallProgressCard
                site={{
                  id: site.id,
                  name: site.name,
                  startedAt: site.startedAt,
                  endedAt: site.endedAt,
                  overallProgress: site.overallProgress,
                  status: site.status,
                }}
              />
            </div>
          ))}
        </section>
        <TasksBoard initialTasks={state.tasks} />
      </div>
      <BottomNav />
    </main>
  );
}
