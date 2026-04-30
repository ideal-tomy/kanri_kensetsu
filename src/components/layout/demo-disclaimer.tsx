type Variant = "inline" | "banner";

interface DemoDisclaimerProps {
  variant?: Variant;
  context?: "data" | "ai" | "dispatch";
}

const messages: Record<NonNullable<DemoDisclaimerProps["context"]>, string> = {
  data:
    "本画面の人物・会社名・案件はデモ用の架空設定です。個人の特定に繋がる実データは使用していません。",
  ai: "AIの出力は補助情報です。承認・最終判断は必ず担当者が行ってください。",
  dispatch:
    "配置アラームは履歴メモ等を参照したデモルールによる提示です。最終的な配員判断は担当者の責任で行ってください。",
};

export function DemoDisclaimer({
  variant = "inline",
  context = "data",
}: DemoDisclaimerProps) {
  const text = messages[context];
  if (variant === "banner") {
    return (
      <aside
        className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs leading-relaxed text-zinc-600"
        role="note"
      >
        {text}
      </aside>
    );
  }
  return (
    <p className="text-xs leading-relaxed text-zinc-500" role="note">
      {text}
    </p>
  );
}
