import Link from "next/link";
import { BottomNav } from "@/components/nav/bottom-nav";

export default function WorkerReportingHubPage() {
  return (
    <main className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-zinc-900">報告・連絡</h1>
      <Link href="/m/worker/reporting/regular" className="block rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h2 className="text-xl font-bold text-zinc-900">定例報告画像</h2>
        <p className="mt-1 text-base font-semibold text-zinc-800">朝礼・KY・安全確認などの定例写真を投稿</p>
      </Link>
      <Link href="/m/worker/reporting/progress" className="block rounded-xl border-2 border-zinc-300 bg-white p-4">
        <h2 className="text-xl font-bold text-zinc-900">進捗報告画像</h2>
        <p className="mt-1 text-base font-semibold text-zinc-800">作業進捗が分かる写真とテキスト報告を投稿</p>
      </Link>
      <BottomNav role="worker" />
    </main>
  );
}
