import { BottomNav } from "@/components/nav/bottom-nav";

export default function SupervisorNoticePage() {
  return (
    <main className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">おしらせ</h1>
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="text-sm text-zinc-600">急変更や未提出アラートをここに集約します。</p>
      </section>
      <BottomNav role="supervisor" />
    </main>
  );
}
