import Link from "next/link";
import { ArrowRight, ClipboardCheck, Smartphone } from "lucide-react";
import { DEMO_BRAND } from "@/config/demo-brand";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-6">
      <div className="w-full max-w-2xl space-y-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-primary">{DEMO_BRAND.productCode}</p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-900">
            {DEMO_BRAND.companyName}向け {DEMO_BRAND.productName}
          </h1>
          <p className="mt-2 text-zinc-600">{DEMO_BRAND.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            このデモでは、現場連携・情報共有・書類・原価の最低限の機能に加え、
            <strong className="font-semibold text-zinc-800">配員アラーム</strong>
            と
            <strong className="font-semibold text-zinc-800">報告書のAI下書き</strong>
            が追体験できます。所要目安は約3分です。
          </p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-700">
            <li className="flex gap-2">
              <span className="text-primary" aria-hidden>
                •
              </span>
              <span>
                <strong>管理者として見る</strong>:{" "}
                <Link href="/admin/assignments" className="text-primary underline">
                  配員最適化
                </Link>
                {" → "}
                <Link href="/admin/alerts" className="text-primary underline">
                  アラート
                </Link>
                {" → "}
                <Link href="/admin/documents" className="text-primary underline">
                  書類ハブ
                </Link>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary" aria-hidden>
                •
              </span>
              <span>
                <strong>現場として見る（スマホ操作）</strong>:{" "}
                <Link href="/report/daily" className="text-primary underline">
                  日報一連フロー
                </Link>
              </span>
            </li>
          </ul>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/admin"
              className="flex flex-col rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition hover:border-primary/30 hover:bg-primary-muted"
            >
              <ClipboardCheck className="h-6 w-6 text-primary" aria-hidden />
              <p className="mt-3 text-lg font-semibold text-zinc-900">
                管理者として見る
              </p>
              <p className="mt-1 text-sm text-zinc-600">監督・判断・承認（PC）</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                開く <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href="/report"
              className="flex flex-col rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition hover:border-primary/30 hover:bg-primary-muted"
            >
              <Smartphone className="h-6 w-6 text-primary" aria-hidden />
              <p className="mt-3 text-lg font-semibold text-zinc-900">
                現場として見る
              </p>
              <p className="mt-1 text-sm text-zinc-600">入力・報告（スマホ）</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                開く <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          </div>
        </section>
        <p className="text-center text-xs text-zinc-500">
          表示内容はデモ用の架空データです。AIの判断は補助であり、最終確認は人が行います。
        </p>
      </div>
    </main>
  );
}
