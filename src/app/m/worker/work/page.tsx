import Link from "next/link";
import { BottomNav } from "@/components/nav/bottom-nav";
export default function WorkerWorkPage() {

  return (
    <main className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-zinc-900">業務確認</h1>
      <Link href="/m/worker/work/site" className="block rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h2 className="worker-readable text-xl">今日の現場</h2>
        <p className="mt-2 worker-subtext">メンバー一覧・工程スケジュール・進捗グラフ</p>
      </Link>
      <Link href="/m/worker/work/tasks" className="block rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h2 className="worker-readable text-xl">業務内容</h2>
        <p className="mt-2 worker-subtext">本日ノルマ・実績・残量をひと目で確認</p>
      </Link>
      <BottomNav role="worker" />
    </main>
  );
}
