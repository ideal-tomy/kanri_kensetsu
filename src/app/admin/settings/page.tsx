import { Cog, Database, KeyRound, Sparkles } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { FutureFeatureBadge } from "@/components/common/FutureFeatureBadge";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AdminSettingsPage() {
  return (
    <PageShell
      mode="admin"
      title="設定"
      subtitle="会社情報・接続設定・デモロール切替（準備中）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "設定" },
      ]}
    >
      <section className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title="Supabase 接続"
          subtitle="本番データベースとの連携状態"
        >
          <div className="flex items-start gap-3">
            <div
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${
                isSupabaseConfigured
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              <Database className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-zinc-900">
                {isSupabaseConfigured ? "接続済み" : "未接続（prototype-store のみ）"}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {isSupabaseConfigured
                  ? "Realtime 反映と shadow write が有効です。"
                  : ".env.local に NEXT_PUBLIC_SUPABASE_URL を設定すると有効化されます。"}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                詳しくは docs/supabase-migration.md を参照。
              </p>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="会社情報" subtitle="表示用ブランド">
          <ul className="space-y-2 text-sm text-zinc-700">
            <li className="flex items-center justify-between">
              <span className="text-zinc-500">会社コード</span>
              <span className="font-bold text-zinc-900">YMD35</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-zinc-500">会社名</span>
              <span className="font-bold text-zinc-900">山田建設工業</span>
            </li>
          </ul>
        </ChartCard>
      </section>

      <section className="mt-6">
        <FutureFeatureBadge
          label="将来実装予定 — 詳細設定"
          description="Phase 3 後に追加予定。RBAC・通知・連携 SaaS の設定 UI が並びます。"
        >
          <div className="grid gap-4 p-4 md:grid-cols-3">
            {[
              { icon: KeyRound, title: "ロール・権限", note: "管理者 / 監督 / 作業員" },
              { icon: Sparkles, title: "AI 連携設定", note: "OCR / 音声解析プロバイダ" },
              { icon: Cog, title: "業務ルール", note: "アラーム閾値 / 配員ルール" },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.title}
                  className="rounded-lg border border-zinc-200 bg-white p-3"
                >
                  <Icon className="h-5 w-5 text-purple-600" />
                  <p className="mt-2 font-bold text-zinc-900">{row.title}</p>
                  <p className="text-xs text-zinc-600">{row.note}</p>
                </div>
              );
            })}
          </div>
        </FutureFeatureBadge>
      </section>
    </PageShell>
  );
}
