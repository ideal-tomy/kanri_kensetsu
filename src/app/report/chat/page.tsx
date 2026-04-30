import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { chatMessages, chatThreads, projects } from "@/data/mock";

export default function ReportChatPage() {
  const thread = chatThreads[0];
  const project = projects.find((p) => p.id === thread.projectId);
  const msgs = chatMessages.filter((m) => m.threadId === thread.id);

  return (
    <PageShell mode="report" title="チャット" listHref="/report" listLabel="メニューへ">
      <DemoDisclaimer context="data" />
      <p className="mt-3 text-sm text-zinc-600">
        {project?.projectName} — {thread.title}
      </p>
      <ul className="mt-4 space-y-3">
        {msgs.map((m) => (
          <li
            key={m.id}
            className={`rounded-2xl px-4 py-3 text-sm ${
              m.side === "field"
                ? "ml-6 bg-primary text-primary-foreground"
                : "mr-6 border border-zinc-200 bg-white text-zinc-800"
            }`}
          >
            <p className="text-xs opacity-80">{m.authorLabel}</p>
            <p className="mt-1">{m.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-xs text-zinc-500">
        メッセージ送信UIはデモでは省略しています。
      </p>
    </PageShell>
  );
}
