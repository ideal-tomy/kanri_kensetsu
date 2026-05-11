"use client";

import { MessageSquare } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { ChatThreadList } from "@/components/chat/ChatThreadList";

export default function AdminChatPage() {
  return (
    <PageShell
      mode="admin"
      title="トーク（現場別）"
      subtitle="未読バッジがついた一覧から現場を開きます"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "チャット" },
      ]}
    >
      <ChartCard title="クイック説明" subtitle="リアルタイムはブラウザ間ポーリング／Supabase で購読できます">
        <p className="text-sm text-zinc-700">
          デモはインメモリで動作します。現場を選ぶと LINE 風の画面で送受信・リアクション・ピン留めが試せます。
        </p>
      </ChartCard>

      <section className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <header className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4 py-3">
          <MessageSquare className="h-4 w-4 text-orange-600" />
          <h2 className="text-sm font-bold text-zinc-900">現場一覧</h2>
        </header>
        <ChatThreadList basePath="/admin/chat" />
      </section>
    </PageShell>
  );
}
