import {
  AlertTriangle,
  BriefcaseBusiness,
  Camera,
  ClipboardCheck,
  FileText,
  Handshake,
  ReceiptText,
  TrendingUp,
  Users,
} from "lucide-react";
import { InfoCard } from "@/components/ui/info-card";

const primaryCards = [
  {
    title: "現場報告・写真ハブ",
    description: "現場写真を一元管理（最重要）",
    href: "/admin/reports/photos",
    icon: Camera,
    badge: "最重要",
  },
  {
    title: "作業員管理",
    description: "本日の推奨アサインと稼働状況を確認",
    href: "/admin/workers",
    icon: Users,
    badge: "AI",
  },
];

const secondaryCards = [
  {
    title: "配員最適化",
    description: "スキルマッチ候補を提示",
    href: "/admin/assignments",
    icon: ClipboardCheck,
    badge: "AI",
  },
  {
    title: "安全書類",
    description: "提出・承認状況を管理",
    href: "/admin/safety-docs",
    icon: FileText,
  },
  {
    title: "請求見込み",
    description: "売上推移の確認",
    href: "/admin/billing",
    icon: TrendingUp,
  },
  {
    title: "現場手配進捗",
    description: "要フォロー案件を強調表示",
    href: "/admin/dispatch",
    icon: Handshake,
  },
  {
    title: "現場案件",
    description: "進行中案件のサマリー",
    href: "/admin/projects",
    icon: BriefcaseBusiness,
  },
  {
    title: "連携・アラート",
    description: "AI検知通知と不具合報告",
    href: "/admin/alerts",
    icon: AlertTriangle,
  },
  {
    title: "社内ナレッジ",
    description: "FAQと手順を共有",
    href: "/admin/knowledge",
    icon: ReceiptText,
  },
];

export function AdminCards() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-zinc-900">最重要機能</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {primaryCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-base font-semibold text-zinc-700">その他できること</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {secondaryCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
