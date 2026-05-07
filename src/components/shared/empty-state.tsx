export function EmptyState({ label = "まだありません" }: { label?: string }) {
  return <p className="text-sm text-zinc-500">{label}</p>;
}
