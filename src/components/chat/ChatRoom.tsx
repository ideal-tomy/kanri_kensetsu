"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pin, Send, Smile } from "lucide-react";
import type { ChatMessage } from "@/lib/chat/types";

const QUICK_REACTIONS = ["👍", "❤️", "😊"];

export function ChatRoom({
  siteId,
  siteName,
  backHref,
  currentUserId,
}: {
  siteId: string;
  siteName: string;
  backHref: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [members, setMembers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const pinned = useMemo(
    () => messages.filter((m) => m.is_pinned && !m.deleted_at),
    [messages],
  );

  async function refresh() {
    const res = await fetch(`/api/chat/messages?siteId=${encodeURIComponent(siteId)}`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages ?? []);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    const id = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 初回のみ
  }, [siteId]);

  useEffect(() => {
    const id = window.setInterval(() => {
      void refresh();
    }, 8000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/chat/members?siteId=${encodeURIComponent(siteId)}`);
      if (!res.ok) return;
      const data = await res.json();
      setMembers(data.members ?? []);
    })();
  }, [siteId]);

  async function send() {
    const body = text.trim();
    if (!body) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, body }),
      });
      if (!res.ok) return;
      setText("");
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  async function react(messageId: string, emoji: string) {
    await fetch(`/api/chat/messages/${encodeURIComponent(messageId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, emoji }),
    });
    await refresh();
  }

  async function pin(messageId: string) {
    await fetch(`/api/chat/messages/${encodeURIComponent(messageId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, pin: true }),
    });
    await refresh();
  }

  function insertMention(name: string) {
    setText((t) => `${t}@${name} `);
    setMentionOpen(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 pb-24 pt-2">
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-zinc-200 bg-white px-3 py-3 shadow-sm">
        <Link
          href={backHref}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800"
          aria-label="戻る"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-zinc-900">{siteName}</p>
          <p className="text-[11px] text-zinc-500">現場トーク</p>
        </div>
      </header>

      {pinned.length > 0 ? (
        <section className="mx-3 mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm">
          <p className="flex items-center gap-1 font-bold text-amber-900">
            <Pin className="h-4 w-4" />
            ピン留め（{pinned.length}）
          </p>
          <ul className="mt-1 space-y-1 text-xs text-amber-950">
            {pinned.map((m) => (
              <li key={m.id} className="line-clamp-2">
                {m.sender_name}: {m.body}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex-1 space-y-3 px-3 py-4">
        {messages.map((m) => {
          const mine = m.sender_id === currentUserId;
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${mine ? "items-end" : "items-start"}`}>
                {!mine ? (
                  <p className="mb-0.5 text-[11px] font-medium text-zinc-600">
                    {m.sender_name}
                  </p>
                ) : null}
                <div
                  className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    mine
                      ? "rounded-br-sm bg-emerald-600 text-white"
                      : "rounded-bl-sm border border-zinc-200 bg-white text-zinc-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 px-1">
                  <span className="text-[10px] text-zinc-400">
                    {new Date(m.created_at).toLocaleTimeString("ja-JP", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {mine ? (
                    <span className="text-[10px] text-zinc-400">既読</span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => pin(m.id)}
                    className="text-[10px] text-amber-700 underline"
                  >
                    ピン
                  </button>
                  {QUICK_REACTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      className="text-base leading-none"
                      onClick={() => react(m.id, e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                {Object.keys(m.reactions).length > 0 ? (
                  <p className="mt-0.5 px-1 text-xs text-zinc-600">
                    {Object.entries(m.reactions).map(([emoji, ids]) => (
                      <span key={emoji} className="mr-2">
                        {emoji}
                        {ids.length}
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-white p-2">
        {mentionOpen ? (
          <div className="mb-2 max-h-32 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 text-sm shadow-lg">
            {members.map((name) => (
              <button
                key={name}
                type="button"
                className="block w-full rounded px-2 py-1 text-left hover:bg-zinc-100"
                onClick={() => insertMention(name)}
              >
                @{name}
              </button>
            ))}
          </div>
        ) : null}
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <button
            type="button"
            className="mb-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-800"
            onClick={() => setMentionOpen((v) => !v)}
            aria-label="メンション"
          >
            <Smile className="h-5 w-5" />
          </button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="メッセージ（@ で名前）"
            className="min-h-11 flex-1 resize-none rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
          />
          <button
            type="button"
            disabled={loading || !text.trim()}
            onClick={send}
            className="mb-1 inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-emerald-600 text-white disabled:opacity-40"
            aria-label="送信"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
