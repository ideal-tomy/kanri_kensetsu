"use client";

import { useState } from "react";

type Props = {
  unit?: string;
  current: number;
  planned?: number;
  onAdd: (delta: number) => void;
};

function QuickButton({ delta, onAdd }: { delta: number; onAdd: (delta: number) => void }) {
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const timer = window.setTimeout(() => {
      onAdd(-delta);
      target.dataset.long = "1";
    }, 600);
    const clear = () => {
      window.clearTimeout(timer);
      target.removeEventListener("pointerup", clear);
      target.removeEventListener("pointerleave", clear);
    };
    target.addEventListener("pointerup", clear);
    target.addEventListener("pointerleave", clear);
  };
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    if (target.dataset.long === "1") {
      target.dataset.long = "";
      return;
    }
    onAdd(delta);
  };
  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className="min-h-[60px] flex-1 rounded-xl bg-orange-500 text-lg font-bold text-white shadow-md transition active:scale-95"
      aria-label={`+${delta}（長押しで−${delta}）`}
    >
      +{delta}
    </button>
  );
}

export function QuantityInput({ unit, current, planned, onAdd }: Props) {
  const [showPad, setShowPad] = useState(false);
  const [draft, setDraft] = useState("");

  const remaining = planned != null ? Math.max(0, planned - current) : null;

  const submitPad = () => {
    const n = Number(draft);
    if (!Number.isNaN(n) && n !== 0) {
      onAdd(n);
    }
    setDraft("");
    setShowPad(false);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-sm font-semibold text-zinc-700">
        できた数を入れてね
        {unit ? <span className="ml-1 text-zinc-500">（{unit}）</span> : null}
        {remaining != null ? (
          <span className="ml-2 text-zinc-500">のこり {remaining}{unit ?? ""}</span>
        ) : null}
      </p>
      <div className="mt-2 flex gap-2">
        <QuickButton delta={1} onAdd={onAdd} />
        <QuickButton delta={5} onAdd={onAdd} />
        <QuickButton delta={10} onAdd={onAdd} />
      </div>
      <button
        type="button"
        onClick={() => setShowPad(true)}
        className="mt-2 min-h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 font-semibold text-zinc-800"
      >
        数値で入れる
      </button>
      {showPad ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-4 sm:rounded-2xl">
            <p className="text-lg font-bold">数値で入れる</p>
            <p className="text-sm text-zinc-600">
              いま {current}
              {unit ?? ""}
              。何個ふやす？（マイナスもOK）
            </p>
            <input
              type="number"
              inputMode="numeric"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="mt-3 min-h-[60px] w-full rounded-xl border border-zinc-300 px-4 text-2xl font-bold"
              placeholder="例: 3"
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  setShowPad(false);
                }}
                className="min-h-[60px] rounded-xl bg-zinc-200 text-lg font-bold text-zinc-800"
              >
                やめる
              </button>
              <button
                type="button"
                onClick={submitPad}
                className="min-h-[60px] rounded-xl bg-orange-500 text-lg font-bold text-white"
              >
                これでOK
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
