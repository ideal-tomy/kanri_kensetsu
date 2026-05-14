import Link from "next/link";

interface PreviewBannerProps {
  preview: boolean;
  scope: "worker" | "supervisor";
  displayName: string;
}

const ROLE_LABEL: Record<PreviewBannerProps["scope"], string> = {
  worker: "職人",
  supervisor: "現場監督",
};

export function PreviewBanner({ preview, scope, displayName }: PreviewBannerProps) {
  if (!preview) return null;

  return (
    <div className="border-b border-amber-300 bg-amber-100 px-4 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold leading-snug text-amber-950 md:text-sm">
          経営者プレビュー中：{displayName}（{ROLE_LABEL[scope]}）として表示しています。
        </p>
        <Link
          href="/admin"
          className="shrink-0 rounded-md bg-amber-800 px-2.5 py-1 text-xs font-bold text-white hover:bg-amber-900"
        >
          管理画面に戻る
        </Link>
      </div>
    </div>
  );
}
