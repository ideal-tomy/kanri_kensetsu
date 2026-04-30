import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarRange,
  Camera,
  ClipboardCheck,
  FileText,
  Handshake,
  MessageSquare,
  Mic,
  ReceiptText,
  TrendingUp,
  Users,
} from "lucide-react";
import { InfoCard } from "@/components/ui/info-card";

const pillar1 = [
  {
    title: "チャット（現場・事務所）",
    description: "スレッドで連絡履歴を共有",
    href: "/admin/chat",
    icon: MessageSquare,
    badge: "連携",
  },
  {
    title: "勤怠（出退勤）",
    description: "スマホから打刻・当日サマリー",
    href: "/report/attendance",
    icon: CalendarRange,
    badge: "スマホ",
  },
  {
    title: "ボイス日報",
    description: "音声入力とAI整形（現場）",
    href: "/report/voice",
    icon: Mic,
    badge: "スマホ",
  },
];

const pillar2 = [
  {
    title: "案件・現場住所",
    description: "進行中案件と所在地の確認",
    href: "/admin/projects",
    icon: BriefcaseBusiness,
  },
  {
    title: "施工写真の保管",
    description: "現場写真を一元管理",
    href: "/admin/reports/photos",
    icon: Camera,
    badge: "重要",
  },
  {
    title: "工程スケジュール",
    description: "案件詳細でガント風の工程を表示",
    href: "/admin/projects/p1",
    icon: CalendarRange,
  },
];

const pillar3 = [
  {
    title: "書類作成ハブ",
    description: "現場報告・完工・労務費のAI下書き",
    href: "/admin/documents",
    icon: FileText,
    badge: "AI",
  },
  {
    title: "請求見込み",
    description: "月次売上見込みの確認",
    href: "/admin/billing",
    icon: TrendingUp,
  },
  {
    title: "安全書類",
    description: "提出・承認状況",
    href: "/admin/safety-docs",
    icon: ClipboardCheck,
  },
];

const operations = [
  {
    title: "作業員管理",
    description: "稼働状況とプロフィール",
    href: "/admin/workers",
    icon: Users,
    badge: "AI",
  },
  {
    title: "配員最適化",
    description: "スコア・配置アラーム",
    href: "/admin/assignments",
    icon: ClipboardCheck,
    badge: "AI",
  },
  {
    title: "現場手配進捗",
    description: "要フォロー案件",
    href: "/admin/dispatch",
    icon: Handshake,
  },
  {
    title: "連携・アラート",
    description: "AI検知と通知",
    href: "/admin/alerts",
    icon: AlertTriangle,
    badge: "AI",
  },
  {
    title: "社内ナレッジ",
    description: "手順・FAQ",
    href: "/admin/knowledge",
    icon: ReceiptText,
  },
];

export function AdminCards() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-1 text-lg font-semibold text-zinc-900">
          現場との連携
        </h2>
        <p className="mb-3 text-sm text-zinc-600">
          コミュニケーション、勤怠、日報の最小セット
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pillar1.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-1 text-lg font-semibold text-zinc-900">
          現場の情報共有
        </h2>
        <p className="mb-3 text-sm text-zinc-600">
          住所、写真、工程・図面の参照
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pillar2.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-1 text-lg font-semibold text-zinc-900">
          書類作成・原価
        </h2>
        <p className="mb-3 text-sm text-zinc-600">
          報告書類と労務費・売上のイメージ
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pillar3.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-1 text-base font-semibold text-zinc-800">
          運用・管理補助
        </h2>
        <p className="mb-3 text-sm text-zinc-600">
          配員、アラート、手配、ナレッジ
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {operations.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
