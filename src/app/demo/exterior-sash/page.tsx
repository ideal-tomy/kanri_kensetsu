import Link from "next/link";
import {
  EXTERIOR_SASH_BEFORE_AFTER,
  EXTERIOR_SASH_DEMO_STEPS,
  EXTERIOR_SASH_DEMO_TAGLINE,
} from "@/data/mock/exterior-sash-demo";
import { ArrowRight, Check, Smartphone, Building2 } from "lucide-react";

export default function ExteriorSashDemoLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-primary">
          建設業向け · 外壁・サッシ施工デモ
        </p>
        <h1 className="mt-3 text-center text-3xl font-black leading-tight md:text-4xl">
          現場と内勤の
          <span className="text-primary">「詰まり」</span>
          を、画面の主役にする
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg font-semibold text-zinc-300">
          {EXTERIOR_SASH_DEMO_TAGLINE}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-red-500/30 bg-red-950/40 p-6">
            <h2 className="text-sm font-black uppercase text-red-300">Before</h2>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-200">
              {EXTERIOR_SASH_BEFORE_AFTER.before.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="text-red-400">✕</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-6">
            <h2 className="text-sm font-black uppercase text-emerald-300">After</h2>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-200">
              {EXTERIOR_SASH_BEFORE_AFTER.after.map((t) => (
                <li key={t} className="flex gap-2">
                  <Check className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="text-center text-xl font-black md:text-2xl">3分デモのすすめ方</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm font-semibold text-zinc-400">
            中央が「メイン」、下に「追加可能」がある構成です。混在させすぎないようになっています。
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {EXTERIOR_SASH_DEMO_STEPS.map((step, idx) => (
              <Link
                key={step.title}
                href={step.href}
                className="group flex flex-col rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6 transition hover:border-primary hover:bg-zinc-800"
              >
                <span className="text-xs font-black text-primary">Step {idx + 1}</span>
                <span className="mt-2 flex items-center gap-2 text-lg font-black text-white">
                  {idx === 0 ? <Smartphone className="h-6 w-6 text-primary" /> : null}
                  {idx === 1 ? <Building2 className="h-6 w-6 text-primary" /> : null}
                  {idx === 2 ? <ArrowRight className="h-6 w-6 text-primary" /> : null}
                  {step.title}
                </span>
                <p className="mt-2 flex-1 text-sm font-semibold text-zinc-400">{step.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
                  開く
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-dashed border-zinc-600 bg-zinc-900/50 p-6">
          <h3 className="text-sm font-black uppercase tracking-wide text-zinc-500">
            追加でつなげられる機能（メインではない）
          </h3>
          <p className="mt-2 text-sm font-semibold text-zinc-400">
            チャット、配員、協力会社、請求、安全書類、業種別ダッシュボードなどは既存メニューから拡張できます。
            商談では下段のリンクだけ軽く触れてください。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["/admin/chat", "/admin/assignments", "/admin/master/report-templates"].map((href) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-zinc-600 px-3 py-1 text-xs font-bold text-zinc-300 hover:border-zinc-400"
              >
                {href}
              </Link>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-zinc-600">
          本番のログイン導線は通常どおり /login 。このデモは prototype-store ベースで動作します。
        </p>
      </div>
    </div>
  );
}
