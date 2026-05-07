"use client";

import { useEffect, useMemo, useState } from "react";

type Site = { id: string; name: string };
type Category = "regular" | "progress";

const CATEGORY_LABEL: Record<Category, string> = {
  regular: "定例報告画像",
  progress: "進捗報告画像",
};

const CATEGORY_GUIDE: Record<Category, string> = {
  regular: "朝礼・KY・安全確認など、日次の定例共有に必要な写真を投稿",
  progress: "作業の進み具合が分かる写真を投稿（数量や進捗率に紐づく内容）",
};

export function WorkerReportingForm({ category }: { category: Category }) {
  const [sites, setSites] = useState<Site[]>([]);
  const [siteId, setSiteId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoNote, setPhotoNote] = useState("");
  const [rawText, setRawText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/sites")
      .then((res) => res.json())
      .then((data) => {
        const nextSites = data.sites ?? [];
        setSites(nextSites);
        if (nextSites.length > 0) {
          setSiteId(nextSites[0].id);
        }
      });
  }, []);

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === siteId),
    [siteId, sites],
  );

  const submitPhoto = async () => {
    setMessage("");
    const res = await fetch("/api/photos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        siteId,
        category,
        fileName: selectedFile?.name,
        title: photoTitle,
        note: photoNote,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message ?? "写真投稿に失敗しました");
      return;
    }
    setMessage(`${CATEGORY_LABEL[category]}を投稿しました`);
    setSelectedFile(null);
    setPhotoTitle("");
    setPhotoNote("");
  };

  const submitTextReport = async () => {
    setMessage("");
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ siteId, rawText }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message ?? "報告送信に失敗しました");
      return;
    }
    setMessage("テキスト報告を送信しました");
    setRawText("");
  };

  return (
    <section className="space-y-4 rounded-xl border-2 border-zinc-300 bg-white p-4">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">{CATEGORY_LABEL[category]}</h2>
        <p className="mt-1 text-base font-semibold text-zinc-800">{CATEGORY_GUIDE[category]}</p>
      </div>

      <label className="block text-base font-bold text-zinc-900">
        現場
        <select
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3"
        >
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-lg border border-zinc-300 bg-zinc-50 p-3">
        <p className="text-base font-bold text-zinc-900">写真投稿</p>
        <p className="mt-1 text-sm font-semibold text-zinc-800">
          投稿先：{selectedSite?.name ?? "現場未選択"} / {CATEGORY_LABEL[category]}
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          className="mt-2 block min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900"
        />
        {selectedFile ? (
          <p className="mt-1 text-sm font-semibold text-zinc-900">選択中: {selectedFile.name}</p>
        ) : null}
        {category === "progress" ? (
          <input
            value={photoTitle}
            onChange={(e) => setPhotoTitle(e.target.value)}
            placeholder="例: 外壁東側画像"
            className="mt-2 min-h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm font-semibold text-zinc-900"
          />
        ) : null}
        <textarea
          value={photoNote}
          onChange={(e) => setPhotoNote(e.target.value)}
          rows={2}
          placeholder="写真の補足（任意）"
          className="mt-2 w-full rounded-lg border border-zinc-300 p-3 text-sm font-semibold text-zinc-900"
        />
        <button
          type="button"
          onClick={submitPhoto}
          className="mt-2 min-h-11 w-full rounded-lg bg-zinc-900 text-base font-bold text-white"
        >
          写真を投稿
        </button>
      </div>

      <div className="rounded-lg border border-zinc-300 bg-zinc-50 p-3">
        <p className="text-base font-bold text-zinc-900">テキスト報告</p>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={4}
          placeholder="今日の報告内容を入力"
          className="mt-2 w-full rounded-lg border border-zinc-300 p-3 text-sm font-semibold text-zinc-900"
        />
        <button
          type="button"
          onClick={submitTextReport}
          className="mt-2 min-h-11 w-full rounded-lg bg-orange-600 text-base font-bold text-white"
        >
          報告を送信
        </button>
      </div>

      {message ? <p className="text-base font-bold text-zinc-900">{message}</p> : null}
    </section>
  );
}
