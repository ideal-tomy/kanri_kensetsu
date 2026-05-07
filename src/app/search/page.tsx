"use client";

import { useState } from "react";
import { BottomNav } from "@/components/nav/bottom-nav";
import { COPY } from "@/lib/copy";

type Result = {
  id: string;
  type: string;
  title: string;
  text: string;
  createdAt: string;
};

const SUGGESTS = ["雨天", "中断", "不具合", "やり直し", "材料まち", "鉄筋"];
const TAGS = ["着工前", "施工中", "完了", "不具合", "安全確認", "検査"];

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searched, setSearched] = useState(false);

  const search = async (term?: string) => {
    const word = (term ?? q).trim();
    if (!word) return;
    setQ(word);
    setSearched(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(word)}`);
    const data = await res.json();
    setResults(data.results ?? []);
  };

  return (
    <main className="min-h-screen bg-zinc-100 p-4 pb-24">
      <div className="mx-auto max-w-3xl space-y-4">
        <section className="rounded-xl bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-bold">{COPY.search.title}</h1>
          <p className="text-sm text-zinc-600">{COPY.search.placeholder}</p>
          <div className="mt-3 flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void search();
              }}
              className="min-h-11 flex-1 rounded-lg border border-zinc-300 px-3"
              placeholder={COPY.search.placeholder}
            />
            <button
              type="button"
              onClick={() => search()}
              className="min-h-11 rounded-lg bg-zinc-900 px-4 font-semibold text-white"
            >
              探す
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-zinc-800">{COPY.search.suggest_title}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUGGESTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void search(s)}
                className="min-h-11 rounded-full bg-orange-100 px-4 text-sm font-semibold text-orange-800 active:scale-95"
              >
                #{s}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm font-bold text-zinc-800">{COPY.search.tag_title}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => void search(t)}
                className="min-h-11 rounded-full bg-zinc-100 px-4 text-sm font-semibold text-zinc-800 active:scale-95"
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          {!searched ? (
            <p className="text-sm text-zinc-600">
              上のキーワードかタグから、過去のしごとや日報をたどれます
            </p>
          ) : results.length === 0 ? (
            <p className="text-sm text-zinc-600">{COPY.search.no_results}</p>
          ) : null}
          {results.map((item) => (
            <article
              key={`${item.type}-${item.id}`}
              className="mt-2 rounded-lg border border-zinc-200 p-3"
            >
              <p className="text-xs font-semibold text-zinc-500">
                {item.type === "report" ? "日報" : item.type === "task" ? "しごと" : item.type}
              </p>
              <p className="font-bold">{item.title}</p>
              <p className="text-sm">{item.text}</p>
            </article>
          ))}
        </section>
      </div>
      <BottomNav />
    </main>
  );
}
