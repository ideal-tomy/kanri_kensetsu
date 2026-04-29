import { AdminCards } from "@/components/admin/admin-cards";
import { ModeHeader } from "@/components/layout/mode-header";
import { aiLogs, alertNotifications, projects, workers } from "@/data/mock";
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
        subtitle="配員・工程・安全書類を統合して確認できます。"
      />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">作業員</p>
            <p className="mt-1 text-3xl font-bold">{workers.length}</p>
            <p className="text-sm text-zinc-600">有資格者: 2名</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">現場案件</p>
            <p className="mt-1 text-3xl font-bold">{projects.length}</p>
            <p className="text-sm text-zinc-600">要フォロー: 2件</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">請求見込み（月次）</p>
            <p className="mt-1 text-3xl font-bold">{formatCurrency(monthlyTotal)}</p>
            <p className="text-sm text-zinc-600">直近予測</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">未読アラート</p>
            <p className="mt-1 text-3xl font-bold">
              {alertNotifications.filter((item) => !item.isRead).length}
            </p>
            <p className="text-sm text-zinc-600">施工不良検知を含む</p>
          </div>
        </section>

        <AdminCards />

        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-zinc-900">AIログ</h2>
          <ul className="mt-3 space-y-2">
            {aiLogs.map((log) => (
              <li key={log.id} className="rounded-md bg-zinc-50 p-3 text-sm">
                <p className="font-medium text-zinc-800">{log.message}</p>
                <p className="mt-1 text-xs text-zinc-500">{log.timestamp}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
