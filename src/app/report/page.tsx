import Link from "next/link";
import { BookOpen, Bug, Camera, Mic } from "lucide-react";
import { ModeHeader } from "@/components/layout/mode-header";
import { DEMO_BRAND } from "@/config/demo-brand";

const buttons = [
  { href: "/report/photo", label: "施工写真撮影", icon: Camera },
  { href: "/report/voice", label: "ボイス日報", icon: Mic },
  { href: "/report/blueprints", label: "図面確認", icon: BookOpen },
  { href: "/report/defects", label: "不具合・傷報告", icon: Bug },
];

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-[#e7e3df]">
      <ModeHeader current="report" title="現場報告画面" subtitle="スマホ入力デモ" />
      <main className="mx-auto w-full max-w-md px-4 py-6">
        <section className="rounded-xl border border-zinc-300 bg-white p-4">
          <p className="text-sm text-zinc-600">ログイン中: ryojitomii@gmail.com</p>
          <p className="text-base font-semibold text-zinc-800">権限: 管理者</p>
          <p className="text-sm text-zinc-600">導入テンプレート: {DEMO_BRAND.companyName}</p>
        </section>
        <div className="mt-6 space-y-4">
          {buttons.map((button) => (
            <Link
              key={button.href}
              href={button.href}
              className="flex h-24 items-center justify-center gap-3 rounded-3xl bg-orange-600 text-3xl font-bold text-white shadow-sm"
            >
              <button.icon className="h-8 w-8" />
              {button.label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
