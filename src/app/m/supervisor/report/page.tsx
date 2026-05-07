import { BottomNav } from "@/components/nav/bottom-nav";
import { ReportForm } from "@/components/report/report-form";

export default function SupervisorReportPage() {
  return (
    <main className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">日報</h1>
      <ReportForm />
      <BottomNav role="supervisor" />
    </main>
  );
}
