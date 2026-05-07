import { BottomNav } from "@/components/nav/bottom-nav";

export default function SupervisorPhotoPage() {
  return (
    <main className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">写真</h1>
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="text-sm text-zinc-600">監督は現場写真の確認とタグ付けができます。</p>
      </section>
      <BottomNav role="supervisor" />
    </main>
  );
}
