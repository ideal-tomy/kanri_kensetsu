export const UNIT_PRESETS = [
  { value: "枚", label: "枚", step: 1 },
  { value: "m²", label: "㎡", step: 1 },
  { value: "本", label: "本", step: 1 },
  { value: "m", label: "m", step: 0.5 },
  { value: "箇所", label: "箇所", step: 1 },
  { value: "㎥", label: "㎥", step: 0.5 },
  { value: "個", label: "個", step: 1 },
  { value: "kg", label: "kg", step: 1 },
] as const;

export type UnitPreset = (typeof UNIT_PRESETS)[number];

export const PROGRESS_BAR_COLOR = (pct: number): string => {
  if (pct >= 100) return "bg-green-600";
  if (pct >= 70) return "bg-lime-500";
  if (pct >= 30) return "bg-orange-500";
  return "bg-blue-500";
};
