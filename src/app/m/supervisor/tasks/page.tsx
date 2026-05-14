import { BottomNav } from "@/components/nav/bottom-nav";
import { TasksBoard } from "@/components/task/tasks-board";
import { getViewSession } from "@/lib/auth/preview";
import { getTasksForUser } from "@/lib/prototype-store";

export default async function SupervisorTasksPage() {
  const { user } = await getViewSession("supervisor");
  if (!user) return null;

  return (
    <main className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">進捗</h1>
      <TasksBoard initialTasks={getTasksForUser(user)} />
      <BottomNav role="supervisor" />
    </main>
  );
}
