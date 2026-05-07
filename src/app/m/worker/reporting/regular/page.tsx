import { BottomNav } from "@/components/nav/bottom-nav";
import { WorkerReportingForm } from "@/components/report/worker-reporting-form";

export default function WorkerRegularReportingPage() {
  return (
    <main className="space-y-4 p-4">
      <WorkerReportingForm category="regular" />
      <BottomNav role="worker" />
    </main>
  );
}
