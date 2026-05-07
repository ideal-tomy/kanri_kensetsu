"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/components/nav/bottom-nav";

type NotificationItem = { id: string; title: string; body: string; createdAt: string };

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications ?? []));
  }, []);

  const subscribe = async () => {
    const res = await fetch("/api/notifications/subscribe", { method: "POST" });
    const data = await res.json();
    setMessage(data.message ?? "完了しました");
  };

  return (
    <main className="min-h-screen bg-zinc-100 p-4 pb-24">
      <div className="mx-auto max-w-3xl space-y-4">
        <section className="rounded-xl bg-white p-4">
          <h1 className="text-2xl font-bold">じぶんの設定</h1>
          <button onClick={subscribe} className="mt-3 min-h-[60px] rounded-xl bg-orange-500 px-4 text-lg font-bold text-white">
            おしらせを受け取る
          </button>
          {message ? <p className="mt-2 text-sm font-semibold">{message}</p> : null}
        </section>
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-xl font-bold">おしらせ</h2>
          {notifications.length === 0 ? <p className="text-sm text-zinc-600">まだありません</p> : null}
          {notifications.map((item) => (
            <article key={item.id} className="mt-2 rounded-lg border border-zinc-200 p-3">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm">{item.body}</p>
            </article>
          ))}
        </section>
      </div>
      <BottomNav />
    </main>
  );
}
