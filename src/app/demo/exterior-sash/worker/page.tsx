"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, AlertCircle, Camera, RefreshCw } from "lucide-react";

type FlowStep = "idle" | "arrived" | "working" | "completed";

type WorkerPayload = {
  siteId: string;
  displayName: string;
  shortName: string;
  currentPhase: { id: string; label: string };
  flowStep: FlowStep;
  slots: Array<{ id: string; label: string; required: boolean; filled: boolean }>;
  bottlenecks: Array<
    | { kind: string; missingCount?: number; labels?: string[]; reason?: string }
  >;
  reportReady: boolean;
  missingLabels: string[];
  requiredSlotCount: number;
  recentPhotos: Array<{
    id: string;
    fileName: string;
    storagePath: string;
    createdAt: string;
    userName: string;
  }>;
};

const PHRASES = [
  "特になし",
  "施主様立会い済",
  "翌日追加工事あり",
  "材料待ち",
  "天候により中断",
];

type BoardSite = { siteId: string; displayName: string };

export default function ExteriorSashWorkerDemoPage() {
  const [sitesList, setSitesList] = useState<BoardSite[]>([]);
  const [siteId, setSiteId] = useState("site-es-1");
  const [data, setData] = useState<WorkerPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [pendingSlot, setPendingSlot] = useState<string | null>(null);
  const [noteBySlot, setNoteBySlot] = useState<Record<string, string>>({});

  const loadBoard = useCallback(async () => {
    const res = await fetch("/api/demo/exterior-sash?view=board");
    const json = (await res.json()) as { sites: BoardSite[] };
    const list = json.sites.map((s) => ({
      siteId: s.siteId,
      displayName: s.displayName,
    }));
    setSitesList(list);
    if (list.length && !list.some((s) => s.siteId === siteId)) {
      setSiteId(list[0].siteId);
    }
  }, [siteId]);

  const loadWorker = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `/api/demo/exterior-sash?view=worker&siteId=${encodeURIComponent(siteId)}`,
      );
      if (!res.ok) {
        setData(null);
        return;
      }
      const json = (await res.json()) as { worker: WorkerPayload };
      setData(json.worker);
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

  useEffect(() => {
    void loadWorker();
  }, [loadWorker]);

  const setFlow = async (step: FlowStep) => {
    setMessage("");
    const res = await fetch("/api/demo/exterior-sash/flow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, step }),
    });
    if (!res.ok) {
      setMessage("ステップ更新に失敗しました");
      return;
    }
    await loadWorker();
  };

  const uploadSlot = async (slotId: string, file: File | null) => {
    if (!file) {
      setMessage("画像ファイルを選んでください");
      return;
    }
    setPendingSlot(slotId);
    setMessage("");
    try {
      const res = await fetch("/api/demo/exterior-sash/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          slotId,
          fileName: file.name,
          note: noteBySlot[slotId] || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.message ?? "投稿に失敗しました");
        return;
      }
      setMessage("保存しました（ファイル名は自動です）");
      await loadWorker();
    } finally {
      setPendingSlot(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 pb-24">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">
          デモ · 現場向け（大きなボタンのみ）
        </p>
        <h1 className="mt-1 text-2xl font-black text-zinc-900">今日の現場</h1>
        <p className="mt-1 text-sm text-zinc-600">
          写真のフォルダ名・ファイル名はアプリ側で付けます。枠を選んで撮影するだけ。
        </p>
      </header>

      <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
        <label className="block">
          <span className="text-sm font-bold text-zinc-800">現場を選ぶ</span>
          <select
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="mt-2 min-h-14 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 text-lg font-bold text-zinc-900"
          >
            {sitesList.map((s) => (
              <option key={s.siteId} value={s.siteId}>
                {s.displayName}
              </option>
            ))}
          </select>
        </label>

        {data ? (
          <>
            <section className="rounded-2xl border-2 border-zinc-900 bg-white p-4 shadow-md">
              <p className="text-xs font-bold text-zinc-500">メイン</p>
              <h2 className="text-xl font-black text-zinc-900">{data.displayName}</h2>
              <p className="mt-1 text-sm font-semibold text-zinc-700">
                いまの工程：{data.currentPhase.label}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-zinc-100 px-3 py-1 font-bold text-zinc-800">
                  必須枠 {data.requiredSlotCount} 枚
                </span>
                {data.reportReady ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-900">
                    内勤へ送れる状態（デモ）
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-900">
                    未撮影 {data.missingLabels.slice(0, 3).join("・")}
                    {data.missingLabels.length > 3 ? "…" : ""}
                  </span>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <p className="text-xs font-bold uppercase text-zinc-500">作業ステップ</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => void setFlow("arrived")}
                  className={`min-h-14 rounded-xl border-2 px-3 text-base font-bold shadow-sm ${
                    data.flowStep === "arrived"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-zinc-300 bg-white text-zinc-900"
                  }`}
                >
                  到着した
                </button>
                <button
                  type="button"
                  onClick={() => void setFlow("working")}
                  className={`min-h-14 rounded-xl border-2 px-3 text-base font-bold shadow-sm ${
                    data.flowStep === "working"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-zinc-300 bg-white text-zinc-900"
                  }`}
                >
                  作業中
                </button>
                <button
                  type="button"
                  onClick={() => void setFlow("completed")}
                  className={`col-span-2 min-h-14 rounded-xl border-2 px-3 text-base font-bold shadow-sm ${
                    data.flowStep === "completed"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-zinc-300 bg-white text-zinc-900"
                  }`}
                >
                  本日の作業おわり
                </button>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-zinc-500">写真枠（タップして投稿）</p>
                <button
                  type="button"
                  onClick={() => void loadWorker()}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs font-bold text-zinc-700"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  更新
                </button>
              </div>
              <div className="space-y-3">
                {data.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`rounded-2xl border-2 p-4 ${
                      slot.filled ? "border-emerald-400 bg-emerald-50/50" : "border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-lg font-black text-zinc-900">{slot.label}</p>
                        <p className="text-xs font-semibold text-zinc-500">
                          {slot.required ? "必須" : "任意"}
                        </p>
                      </div>
                      {slot.filled ? (
                        <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-600" aria-hidden />
                      ) : (
                        <Circle className="h-8 w-8 shrink-0 text-zinc-300" aria-hidden />
                      )}
                    </div>
                    <label className="mt-3 block text-sm font-bold text-zinc-800">
                      一言（任意・定型）
                      <select
                        value={noteBySlot[slot.id] ?? ""}
                        onChange={(e) =>
                          setNoteBySlot((prev) => ({ ...prev, [slot.id]: e.target.value }))
                        }
                        className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-2 text-sm"
                      >
                        <option value="">（なし）</option>
                        {PHRASES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="min-h-11 w-full text-sm font-semibold file:mr-2 file:rounded-lg file:border-0 file:bg-zinc-200 file:px-3 file:py-2"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          void uploadSlot(slot.id, file);
                          e.target.value = "";
                        }}
                        disabled={pendingSlot === slot.id}
                      />
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-zinc-600">
                      <Camera className="h-3.5 w-3.5" aria-hidden />
                      投げた画像は自動で名前と保存先が付きます
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {data.bottlenecks.length > 0 ? (
              <section className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertCircle className="h-5 w-5" aria-hidden />
                  内勤が見る注意（参考）
                </div>
                <ul className="mt-2 list-inside list-disc text-sm font-semibold text-amber-900">
                  {data.bottlenecks.map((b, i) => (
                    <li key={i}>
                      {b.kind === "photos_missing" && b.labels
                        ? `未撮影: ${b.labels.join("、")}`
                        : null}
                      {b.kind === "report_pending" ? "定型報告が未完了のデモ設定" : null}
                      {b.kind === "phone_confirm" && b.reason ? `電話確認: ${b.reason}` : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {message ? (
              <p className="rounded-lg bg-zinc-900 px-4 py-3 text-center text-sm font-bold text-white">
                {message}
              </p>
            ) : null}

            {loading ? (
              <p className="text-center text-sm text-zinc-500">読み込み中…</p>
            ) : null}
          </>
        ) : (
          <p className="text-center text-zinc-600">データを読み込めませんでした。</p>
        )}

        <aside className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
            追加可能機能（このデモでは下に配置）
          </p>
          <ul className="mt-2 space-y-1 text-sm font-semibold text-zinc-600">
            <li>· 現場チャット・配員・協力会社管理は別画面から拡張可能</li>
            <li>· 音声入力・AI整形も接続可能</li>
          </ul>
          <Link
            href="/demo/exterior-sash"
            className="mt-3 inline-block text-sm font-bold text-primary underline"
          >
            商談用トップへ戻る
          </Link>
        </aside>
      </div>
    </div>
  );
}
