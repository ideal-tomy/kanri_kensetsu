import Link from "next/link";
import {
  BookOpen,
  Bug,
  CalendarClock,
  Camera,
  ClipboardList,
  MessageSquare,
} from "lucide-react";
import { ModeHeader } from "@/components/layout/mode-header";
import { DEMO_BRAND } from "@/config/demo-brand";

const flow = [
  { step: 1, label: "日報報告を開く", href: "/report/daily" },
  { step: 2, label: "報告項目ごとに写真をアップ/撮影", href: "/report/daily" },
  { step: 3, label: "追加内容をボイス or テキストで送信", href: "/report/daily" },
];

const groups: {
  title: string;
  hint: string;
  items: { href: string; label: string; icon: typeof Camera }[];
}[] = [
  {
    title: "現場との連携",
    hint: "チャット・勤怠・日報",
    items: [
      { href: "/report/chat", label: "チャット", icon: MessageSquare },
      { href: "/report/attendance", label: "勤怠（打刻）", icon: CalendarClock },
      { href: "/report/daily", label: "日報報告（まとめて）", icon: ClipboardList },
    ],
  },
  {
    title: "情報の共有",
    hint: "図面・不具合など",
    items: [
      { href: "/report/blueprints", label: "図面確認", icon: BookOpen },
      { href: "/report/defects", label: "不具合・傷報告", icon: Bug },
      { href: "/report/photo", label: "施工写真", icon: Camera },
    ],
  },
];

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-[#f4f1ec]">
      <ModeHeader
        current="report"
        title="現場メニュー"
        subtitle={`${DEMO_BRAND.productName}（スマホ）`}
      />
      <main className="mx-auto w-full max-w-md px-4 py-6">
        <section className="rounded-xl border border-primary/20 bg-primary-muted/80 p-4">
          <p className="text-sm font-semibold text-zinc-900">おすすめフロー</p>
          <ol className="mt-3 space-y-2">
            {flow.map((item) => (
              <li key={item.step} className="flex items-start gap-3 text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {item.step}
                </span>
                <Link
                  href={item.href}
                  className="pt-0.5 font-medium text-primary underline decoration-primary/40 underline-offset-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {groups.map((group) => (
          <section key={group.title} className="mt-8">
            <h2 className="text-sm font-semibold text-zinc-500">{group.title}</h2>
            <p className="text-xs text-zinc-500">{group.hint}</p>
            <div className="mt-3 space-y-3">
              {group.items.map((button) => (
                <Link
                  key={button.href}
                  href={button.href}
                  className="flex h-[4.5rem] items-center justify-center gap-3 rounded-3xl bg-primary px-4 text-center text-xl font-bold text-primary-foreground shadow-md transition hover:opacity-95 active:scale-[0.99]"
                >
                  <button.icon className="h-8 w-8 shrink-0" aria-hidden />
                  <span>{button.label}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
