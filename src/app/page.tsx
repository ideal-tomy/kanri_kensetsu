import Link from "next/link";
import { ClipboardCheck, Smartphone } from "lucide-react";
import { DEMO_BRAND } from "@/config/demo-brand";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-6">
      <section className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">
          {DEMO_BRAND.companyName}向け {DEMO_BRAND.productName}
        </h1>
        <p className="mt-2 text-zinc-600">
          入口を選択してください。管理画面と現場報告画面を同一プロジェクトで提供します。
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin"
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 hover:bg-zinc-100"
          >
            <ClipboardCheck className="h-6 w-6 text-orange-600" />
            <p className="mt-3 text-lg font-semibold text-zinc-900">PC管理ダッシュボード</p>
            <p className="text-sm text-zinc-600">/admin</p>
          </Link>
          <Link
            href="/report"
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 hover:bg-zinc-100"
          >
            <Smartphone className="h-6 w-6 text-orange-600" />
            <p className="mt-3 text-lg font-semibold text-zinc-900">スマホ現場報告</p>
            <p className="text-sm text-zinc-600">/report</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
