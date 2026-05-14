import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";
import { BottomNav } from "@/components/nav/bottom-nav";
import { getViewSession } from "@/lib/auth/preview";
import { getAssignmentsForUser, getSitesForUser } from "@/lib/prototype-store";
import { AttendanceClock } from "./attendance-clock";

export default async function WorkerAttendancePage() {
  const { user } = await getViewSession("worker");
  if (!user) return null;

  const today = new Date().toISOString().slice(0, 10);
  const todayAssignment = getAssignmentsForUser(user).find((item) => item.workDate === today);
  const site = getSitesForUser(user).find((item) => item.id === todayAssignment?.siteId);

  return (
    <main className="space-y-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-zinc-900">
          <CalendarClock className="h-6 w-6 text-primary" aria-hidden />
          打刻
        </h1>
        <Link
          href="/m/worker"
          className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-bold text-zinc-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          もどる
        </Link>
      </div>

      <AttendanceClock workerName={user.name} siteName={site?.name} />

      <BottomNav role="worker" />
    </main>
  );
}
