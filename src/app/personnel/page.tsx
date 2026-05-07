import { BottomNav } from "@/components/nav/bottom-nav";
import { PersonnelBoard } from "@/components/personnel/personnel-board";
import { state } from "@/lib/prototype-store";

export default function PersonnelPage() {
  return (
    <main className="min-h-screen bg-zinc-100 p-4 pb-24">
      <div className="mx-auto max-w-5xl space-y-4">
        <PersonnelBoard
          initialAssignments={state.assignments}
          initialSites={state.sites.map((s) => ({ id: s.id, name: s.name }))}
        />
      </div>
      <BottomNav />
    </main>
  );
}
