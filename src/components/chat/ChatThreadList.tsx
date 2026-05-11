"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type ThreadRow = {
  site_id: string;
  site_name: string;
  last_body: string | null;
  last_at: string;
  unread_count: number;
};

export function ChatThreadList({
  basePath,
}: {
  /** 例: /m/worker/chat または /m/supervisor/chat */
  basePath: string;
}) {
  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/chat/threads");
      if (!res.ok) {
        setErr("一覧を読み込めませんでした");
        return;
      }
      const data = await res.json();
      setThreads(data.threads ?? []);
    })();
  }, []);

  if (err) {
    return <p className="px-4 py-6 text-center text-sm text-red-600">{err}</p>;
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {threads.map((t) => (
        <li key={t.site_id}>
          <Link
            href={`${basePath}/${encodeURIComponent(t.site_id)}`}
            className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-bold text-zinc-900">{t.site_name}</p>
                {t.unread_count > 0 ? (
                  <span className="inline-flex min-h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                    {t.unread_count > 99 ? "99+" : t.unread_count}
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs text-zinc-600">
                {t.last_body ?? "まだメッセージがありません"}
              </p>
              <p className="mt-1 text-[10px] text-zinc-400">
                {t.last_at
                  ? new Date(t.last_at).toLocaleString("ja-JP", {
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
