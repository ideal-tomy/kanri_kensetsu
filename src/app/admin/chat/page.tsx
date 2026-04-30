import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { chatMessages, chatThreads, projects } from "@/data/mock";

export default function AdminChatPage() {
  return (
    <PageShell
      mode="admin"
      title="チャット（現場・事務所）"
      subtitle="スレッド単位で連絡履歴を参照（デモ）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "チャット" },
      ]}
    >
      <DemoDisclaimer variant="banner" context="data" />
      <div className="mt-6 space-y-8">
        {chatThreads.map((thread) => {
          const project = projects.find((p) => p.id === thread.projectId);
          const msgs = chatMessages.filter((m) => m.threadId === thread.id);
          return (
            <article
              key={thread.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
            >
              <header className="border-b border-zinc-100 bg-zinc-50 px-4 py-3">
                <h2 className="font-semibold text-zinc-900">{thread.title}</h2>
                <p className="text-sm text-zinc-600">
                  {project?.projectName} ／ 最終更新 {thread.updatedAt}
                </p>
              </header>
              <ul className="divide-y divide-zinc-100">
                {msgs.map((m) => (
                  <li
                    key={m.id}
                    className={`flex gap-3 px-4 py-3 ${
                      m.side === "office" ? "bg-white" : "bg-primary-muted/40"
                    }`}
                  >
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        m.side === "office"
                          ? "bg-zinc-200 text-zinc-800"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {m.side === "office" ? "事務所" : "現場"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-zinc-500">
                        {m.authorLabel} ・ {m.sentAt}
                      </p>
                      <p className="mt-1 text-sm text-zinc-800">{m.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
