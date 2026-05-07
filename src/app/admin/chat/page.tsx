import { MessageSquare } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { ChartCard } from "@/components/charts/ChartCard";
import { StatCard } from "@/components/viz/StatCard";
import { chatMessages, chatThreads, projects } from "@/data/mock";

export default function AdminChatPage() {
  const totalThreads = chatThreads.length;
  const totalMessages = chatMessages.length;
  const officeRatio = chatMessages.length
    ? Math.round(
        (chatMessages.filter((m) => m.side === "office").length /
          chatMessages.length) *
          100,
      )
    : 0;

  return (
    <PageShell
      mode="admin"
      title="チャット（現場・事務所）"
      subtitle="スレッド単位で連絡履歴を参照（mock）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "チャット" },
      ]}
    >
      <DemoDisclaimer variant="banner" context="data" />

      <section className="mt-4 grid gap-3 md:grid-cols-3">
        <StatCard
          label="スレッド数"
          value={totalThreads}
          unit="件"
          icon={MessageSquare}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="メッセージ累計"
          value={totalMessages}
          unit="件"
        />
        <StatCard
          label="事務所発信比"
          value={officeRatio}
          unit="%"
          hint="事務所発信メッセージの割合"
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4 rounded-xl border border-zinc-200 bg-white shadow-sm">
          <header className="border-b border-zinc-100 bg-zinc-50 px-3 py-2">
            <h2 className="text-sm font-bold text-zinc-900">スレッド一覧</h2>
          </header>
          <ul className="divide-y divide-zinc-100">
            {chatThreads.map((thread) => {
              const project = projects.find((p) => p.id === thread.projectId);
              const msgs = chatMessages.filter((m) => m.threadId === thread.id);
              const last = msgs[msgs.length - 1];
              return (
                <li key={thread.id} className="px-3 py-3">
                  <p className="font-bold text-zinc-900">{thread.title}</p>
                  <p className="text-xs text-zinc-500">{project?.projectName}</p>
                  {last ? (
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-700">
                      <span className="font-medium">{last.authorLabel}:</span> {last.body}
                    </p>
                  ) : null}
                  <p className="mt-1 text-[10px] text-zinc-400">
                    {msgs.length} 件 ・ 最終 {thread.updatedAt}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-8 space-y-4">
          {chatThreads.map((thread) => {
            const project = projects.find((p) => p.id === thread.projectId);
            const msgs = chatMessages.filter((m) => m.threadId === thread.id);
            return (
              <ChartCard
                key={thread.id}
                title={thread.title}
                subtitle={`${project?.projectName} ／ 最終 ${thread.updatedAt}`}
              >
                <ul className="space-y-2">
                  {msgs.map((m) => (
                    <li
                      key={m.id}
                      className={`flex gap-2 rounded-lg p-3 ${
                        m.side === "office"
                          ? "bg-zinc-50"
                          : "bg-primary-muted/40"
                      }`}
                    >
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          m.side === "office"
                            ? "bg-zinc-200 text-zinc-800"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {m.side === "office" ? "事務所" : "現場"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-zinc-500">
                          {m.authorLabel} ・ {m.sentAt}
                        </p>
                        <p className="mt-0.5 text-sm text-zinc-800">{m.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </ChartCard>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
