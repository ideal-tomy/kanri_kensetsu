"use client";

import { COPY } from "@/lib/copy";

type Reason = "rain" | "material" | "manpower" | "other";

const ORDER: Reason[] = ["rain", "material", "manpower", "other"];

export function PauseReasonModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (reason: Reason) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-4 sm:rounded-2xl">
        <p className="text-lg font-bold">{COPY.task.interrupt_title}</p>
        <p className="text-sm text-zinc-600">理由をえらんでね</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {ORDER.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                onSelect(r);
                onClose();
              }}
              className="min-h-[60px] rounded-xl bg-red-600 text-lg font-bold text-white shadow-md active:scale-95"
            >
              {COPY.task.pause_reasons[r]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 min-h-11 w-full rounded-xl bg-zinc-200 font-semibold text-zinc-800"
        >
          {COPY.common.cancel}
        </button>
      </div>
    </div>
  );
}
