import type { AiLog } from "@/types/domain";

export function aiLogTypeLabel(type: AiLog["type"]): string {
  switch (type) {
    case "rename":
      return "自動整理";
    case "assignment":
      return "配員照合";
    case "detection":
      return "検知";
    case "summary":
      return "要約・下書き";
    default:
      return type;
  }
}

export function aiLogTypeClasses(type: AiLog["type"]): string {
  switch (type) {
    case "rename":
      return "border-emerald-200 bg-emerald-50";
    case "assignment":
      return "border-amber-200 bg-amber-50";
    case "detection":
      return "border-red-200 bg-red-50";
    case "summary":
      return "border-sky-200 bg-sky-50";
    default:
      return "border-zinc-200 bg-zinc-50";
  }
}
