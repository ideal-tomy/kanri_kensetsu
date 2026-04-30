import Link from "next/link";
import { AdminCards } from "@/components/admin/admin-cards";
import { ModeHeader } from "@/components/layout/mode-header";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { aiLogs, alertNotifications, projects, workers } from "@/data/mock";
import { DEMO_BRAND } from "@/config/demo-brand";
import { aiLogTypeClasses, aiLogTypeLabel } from "@/lib/ai-demo";
import { formatCurrency } from "@/lib/format";
import { revenueForecasts } from "@/data/mock/billing";

const monthlyTotal = revenueForecasts.reduce(
  (sum, item) => sum + item.forecastAmount,
  0,
);

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-zinc-100">
      <ModeHeader
        current="admin"
        title="現場ダッシュボード"
        subtitle={`${DEMO_BRAND.productName} — 配員・工程・安全書類を統合して確認できます。`}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
        <DemoDisclaimer variant="banner" context="ai" />

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-zinc-500">作業員</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{workers.length}</p>
            <p className="text-sm text-zinc-600">有資格者: 2名</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-zinc-500">現場案件</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{projects.length}</p>
            <p className="text-sm text-zinc-600">要フォロー: 2件</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-zinc-500">請求見込み（月次）</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">
              {formatCurrency(monthlyTotal)}
            </p>
            <p className="text-sm text-zinc-600">直近予測</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-zinc-500">未読アラート</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">
              {alertNotifications.filter((item) => !item.isRead).length}
            </p>
            <p className="text-sm text-zinc-600">施工不良検知を含む</p>
          </div>
        </section>

        <AdminCards />

        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-lg font-semibold text-zinc-900">AIログ</h2>
            <Link href="/admin/assignments" className="text-sm font-medium text-primary underline">
              配員画面へ
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {aiLogs.map((log) => (
              <li
                key={log.id}
                className={`rounded-md border p-3 text-sm ${aiLogTypeClasses(log.type)}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-white/80 px-2 py-0.5 text-xs font-semibold text-zinc-800">
                    {aiLogTypeLabel(log.type)}
                  </span>
                  <span className="text-xs text-zinc-600">{log.timestamp}</span>
                </div>
                <p className="mt-2 font-medium text-zinc-900">{log.message}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
