import Link from "next/link";
import { ClipboardCheck, MessageSquareWarning } from "lucide-react";
import { DEMO_BRAND } from "@/config/demo-brand";

interface ModeHeaderProps {
  title: string;
  subtitle?: string;
  current: "admin" | "report";
}

export function ModeHeader({ title, subtitle, current }: ModeHeaderProps) {
  const modeLabel = current === "admin" ? "管理者モード" : "現場モード（スマホ操作）";
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs text-zinc-500">
            {DEMO_BRAND.companyName} {DEMO_BRAND.productName}{" "}
            <span className="font-medium text-primary">{DEMO_BRAND.productCode}</span>
          </p>
          <p className="mt-1 inline-flex rounded-full bg-primary-muted px-2 py-0.5 text-xs font-semibold text-primary">
            {modeLabel}
          </p>
          <h1 className="text-lg font-bold text-zinc-900">{title}</h1>
          {subtitle ? <p className="text-sm text-zinc-600">{subtitle}</p> : null}
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin"
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
              current === "admin"
                ? "bg-primary text-primary-foreground"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            PC管理
          </Link>
          <Link
            href="/report"
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
              current === "report"
                ? "bg-primary text-primary-foreground"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <MessageSquareWarning className="h-4 w-4" />
            現場画面（操作側）
          </Link>
        </div>
      </div>
    </header>
  );
}
