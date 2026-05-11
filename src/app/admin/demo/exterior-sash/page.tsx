"use client";

import { useCallback, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ImageOff,
  MessageSquare,
  Phone,
  RefreshCw,
  Users,
  FileText,
  BarChart3,
  Shield,
  FolderCog,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

type Bottleneck =
  | { kind: "photos_missing"; missingCount: number; labels: string[] }
  | { kind: "report_pending" }
  | { kind: "phone_confirm"; reason: string }
  | { kind: "staff_shortage"; note?: string }
  | { kind: "material_wait"; note?: string };

type BoardSite = {
  siteId: string;
  displayName: string;
  shortName: string;
  currentPhase: { id: string; label: string };
  missingCount: number;
  missingLabels: string[];
  bottlenecks: Bottleneck[];
  reportReady: boolean;
  flowStep: string;
};

export default function ExteriorSashOfficeBoardPage() {
  const [sites, setSites] = useState<BoardSite[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/demo/exterior-sash?view=board");
      const json = (await res.json()) as { sites: BoardSite[] };
      setSites(json.sites ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const photoIssues = sites.filter((s) => s.missingCount > 0);
  const ready = sites.filter((s) => s.reportReady);
  const attention = sites.filter((s) =>
    s.bottlenecks.some((b) => b.kind === "phone_confirm" || b.kind === "report_pending"),
  );

  return (
    <PageShell
      mode="admin"
      title="詰まり解消ボード（外壁・サッシデモ）"
      subtitle="写真不足・確認待ち・PDF化までいける現場だけを上面に表示"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "外壁サッシ詰まりデモ" },
      ]}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-zinc-600">
            メインはこのページだけ見せれば、内勤の「探す・電話する・貼る」がどう減るか説明できます。
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-bold text-zinc-800"
          >
            <RefreshCw className="h-4 w-4" />
            再読込
          </button>
        </div>

        {loading ? (
          <p className="text-center text-zinc-500">読み込み中…</p>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="flex items-center gap-2 text-lg font-black text-red-700">
                <ImageOff className="h-6 w-6" aria-hidden />
                まずここ：写真が足りない現場
              </h2>
              <div className="grid gap-3 md:grid-cols-3">
                {photoIssues.length === 0 ? (
                  <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-sm font-bold text-emerald-900 md:col-span-3">
                    必須枠はすべて埋まっています（デモシード）
                  </p>
                ) : (
                  photoIssues.map((s) => (
                    <SiteCard key={s.siteId} site={s} variant="danger" />
                  ))
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="flex items-center gap-2 text-lg font-black text-amber-800">
                <AlertTriangle className="h-6 w-6" aria-hidden />
                確認が必要（報告・電話）
              </h2>
              <div className="grid gap-3 md:grid-cols-3">
                {attention.length === 0 ? (
                  <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-6 text-sm font-semibold text-zinc-600 md:col-span-3">
                    いまは該当なし
                  </p>
                ) : (
                  attention.map((s) => <SiteCard key={s.siteId} site={s} variant="warn" />)
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="flex items-center gap-2 text-lg font-black text-emerald-800">
                <CheckCircle2 className="h-6 w-6" aria-hidden />
                報告書 PDF までいける現場
              </h2>
              <div className="grid gap-3 md:grid-cols-3">
                {ready.length === 0 ? (
                  <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-6 text-sm font-semibold text-zinc-600 md:col-span-3">
                    電話確認・報告待ちのデモ設定があるため、いまは0件に見えることがあります。
                  </p>
                ) : (
                  ready.map((s) => <SiteCard key={s.siteId} site={s} variant="ok" />)
                )}
              </div>
            </section>
          </>
        )}

        <aside className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6">
          <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
            追加可能機能（デモでは小さく一覧のみ）
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ExtraItem href="/admin/chat" icon={MessageSquare} label="現場チャット" />
            <ExtraItem href="/admin/assignments" icon={Users} label="配員・シフト" />
            <ExtraItem href="/admin/dispatch" icon={Users} label="現場手配・応援" />
            <ExtraItem href="/admin/master/report-templates" icon={FolderCog} label="報告書テンプレ" />
            <ExtraItem href="/admin/billing" icon={BarChart3} label="請求見込み" />
            <ExtraItem href="/admin/safety-docs" icon={Shield} label="安全書類" />
          </div>
        </aside>

        <p className="text-center text-xs text-zinc-500">
          現場員デモ画面は{" "}
          <Link href="/demo/exterior-sash/worker" className="font-bold text-primary underline">
            /demo/exterior-sash/worker
          </Link>
        </p>
      </div>
    </PageShell>
  );
}

function SiteCard({
  site,
  variant,
}: {
  site: BoardSite;
  variant: "danger" | "warn" | "ok";
}) {
  const border =
    variant === "danger"
      ? "border-red-300 bg-red-50/80"
      : variant === "warn"
        ? "border-amber-300 bg-amber-50/80"
        : "border-emerald-300 bg-emerald-50/80";

  return (
    <article className={`rounded-2xl border-2 p-4 shadow-sm ${border}`}>
      <h3 className="text-base font-black text-zinc-900">{site.displayName}</h3>
      <p className="mt-1 text-xs font-semibold text-zinc-600">
        工程: {site.currentPhase.label} · ステップ: {site.flowStep}
      </p>
      {site.missingCount > 0 ? (
        <p className="mt-2 text-sm font-bold text-red-800">
          未撮影 {site.missingCount} 枠: {site.missingLabels.join("・")}
        </p>
      ) : (
        <p className="mt-2 text-sm font-bold text-emerald-800">必須枠は充足</p>
      )}
      <ul className="mt-2 space-y-1 text-xs font-semibold text-zinc-700">
        {site.bottlenecks.map((b, i) => (
          <li key={i} className="flex items-start gap-1">
            {b.kind === "phone_confirm" ? <Phone className="h-3.5 w-3.5 shrink-0 mt-0.5" /> : null}
            {b.kind === "report_pending" ? (
              <FileText className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            ) : null}
            {b.kind === "photos_missing" ? (
              <span>
                未撮影 {b.missingCount} 枠: {b.labels.join("・")}
              </span>
            ) : null}
            {b.kind === "report_pending" ? <span>定型報告が未完了（デモ）</span> : null}
            {b.kind === "phone_confirm" ? <span>{b.reason}</span> : null}
            {b.kind === "staff_shortage" ? <span>人手不足: {b.note ?? "要確認"}</span> : null}
            {b.kind === "material_wait" ? <span>材料待ち: {b.note ?? "要確認"}</span> : null}
          </li>
        ))}
      </ul>
      <Link
        href={`/admin/reports/output?siteId=${encodeURIComponent(site.siteId)}`}
        className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary underline"
      >
        報告書出力へ
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}

function ExtraItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:border-zinc-400"
    >
      <Icon className="h-4 w-4 text-zinc-500" aria-hidden />
      {label}
    </Link>
  );
}
