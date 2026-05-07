import { BottomNav } from "@/components/nav/bottom-nav";
import { WorkerReportingForm } from "@/components/report/worker-reporting-form";

export default function WorkerProgressReportingPage() {
  return (
    <main className="space-y-4 p-4">
      <WorkerReportingForm category="progress" />
      <BottomNav role="worker" />
    </main>
  );
}
