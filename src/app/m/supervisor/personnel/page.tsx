import { BottomNav } from "@/components/nav/bottom-nav";
import { PersonnelBoard } from "@/components/personnel/personnel-board";
import { getSessionFromCookies } from "@/lib/auth/session";
import { getAssignmentsForUser, getSitesForUser } from "@/lib/prototype-store";

export default async function SupervisorPersonnelPage() {
  const user = await getSessionFromCookies();
  if (!user) return null;
  const sites = getSitesForUser(user).map((s) => ({ id: s.id, name: s.name }));

  return (
    <main className="space-y-4 p-4">
      <PersonnelBoard initialAssignments={getAssignmentsForUser(user)} initialSites={sites} />
      <BottomNav role="supervisor" />
    </main>
  );
}
