"use client";

import { ChatThreadList } from "@/components/chat/ChatThreadList";
import { BottomNav } from "@/components/nav/bottom-nav";

export default function SupervisorChatListPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="border-b border-zinc-200 bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-zinc-900">トーク</h1>
        <p className="text-xs text-zinc-500">担当現場の連絡</p>
      </header>
      <ChatThreadList basePath="/m/supervisor/chat" />
      <BottomNav role="supervisor" />
    </div>
  );
}
