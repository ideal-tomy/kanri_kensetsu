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
        subtitle={`${DEMO_BRAND.productName} — 監督・判断・承認を管理者目線で進める画面です。`}
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

        <section className="rounded-xl border border-primary/20 bg-primary-muted/80 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">本日の管理フロー</h2>
          <ol className="mt-3 grid gap-3 md:grid-cols-3">
            <li className="rounded-lg border border-zinc-200 bg-white p-3">
              <p className="text-xs text-zinc-500">STEP 1</p>
              <Link href="/admin/alerts" className="font-semibold text-primary underline">
                アラート確認
              </Link>
              <p className="mt-1 text-sm text-zinc-600">優先度の高い通知から対応</p>
            </li>
            <li className="rounded-lg border border-zinc-200 bg-white p-3">
              <p className="text-xs text-zinc-500">STEP 2</p>
              <Link href="/admin/assignments" className="font-semibold text-primary underline">
                配員判断
              </Link>
              <p className="mt-1 text-sm text-zinc-600">AIアラームを見て確定</p>
            </li>
            <li className="rounded-lg border border-zinc-200 bg-white p-3">
              <p className="text-xs text-zinc-500">STEP 3</p>
              <Link href="/admin/documents" className="font-semibold text-primary underline">
                書類確定
              </Link>
              <p className="mt-1 text-sm text-zinc-600">現場報告を最終アウトプット化</p>
            </li>
          </ol>
          <p className="mt-3 text-xs text-zinc-600">
            現場入力の確認は{" "}
            <Link href="/admin/field-reports" className="font-medium text-primary underline">
              現場報告確認
            </Link>
            でまとめて実施できます。
          </p>
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
