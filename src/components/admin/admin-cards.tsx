import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarRange,
  Camera,
  CirclePlus,
  ClipboardCheck,
  FileText,
  Handshake,
  MessageSquare,
  ReceiptText,
  ScanSearch,
  TrendingUp,
  Users,
} from "lucide-react";
import { InfoCard } from "@/components/ui/info-card";

const heroCards = [
  {
    title: "配員最適化",
    description: "AIアラームを見ながら最終判断",
    href: "/admin/assignments",
    icon: ClipboardCheck,
    badge: "代表",
  },
  {
    title: "連携・アラート",
    description: "優先対応すべきリスクを確認",
    href: "/admin/alerts",
    icon: AlertTriangle,
    badge: "代表",
  },
  {
    title: "現場報告確認",
    description: "現場入力を一覧で確認・承認",
    href: "/admin/field-reports",
    icon: ScanSearch,
    badge: "代表",
  },
  {
    title: "書類作成ハブ",
    description: "報告書の最終アウトプット化",
    href: "/admin/documents",
    icon: FileText,
    badge: "代表",
  },
];

const dailyOps = [
  {
    title: "現場手配進捗",
    description: "要フォロー案件",
    href: "/admin/dispatch",
    icon: Handshake,
  },
  {
    title: "作業員管理",
    description: "稼働状況とプロフィール",
    href: "/admin/workers",
    icon: Users,
  },
  {
    title: "案件・現場住所",
    description: "進行中案件と所在地の確認",
    href: "/admin/projects",
    icon: BriefcaseBusiness,
  },
];

const docsAndCost = [
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
  {
    title: "施工写真の保管",
    description: "現場写真を一元管理",
    href: "/admin/reports/photos",
    icon: Camera,
  },
];

const expandableCards = [
  {
    title: "チャット連携",
    description: "現場と事務所の連絡履歴を確認",
    href: "/admin/chat",
    icon: MessageSquare,
    badge: "連携候補",
  },
  {
    title: "社内ナレッジ",
    description: "手順・FAQ",
    href: "/admin/knowledge",
    icon: ReceiptText,
    badge: "追加可能",
  },
  {
    title: "工程スケジュール拡張",
    description: "案件詳細でガント風の工程を表示",
    href: "/admin/projects/p1",
    icon: CalendarRange,
    badge: "拡張",
  },
  {
    title: "追加連携プレースホルダ",
    description: "外部SaaS連携などを追加可能",
    href: "/admin",
    icon: CirclePlus,
    badge: "拡張",
  },
];

export function AdminCards() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-1 text-lg font-semibold text-zinc-900">
          代表機能（管理者向け）
        </h2>
        <p className="mb-3 text-sm text-zinc-600">
          管理者デモで最初に見せるカード
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {heroCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-1 text-base font-semibold text-zinc-800">日次運用</h2>
        <p className="mb-3 text-sm text-zinc-600">現場監督・手配・稼働確認</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dailyOps.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-1 text-base font-semibold text-zinc-800">原価・書類</h2>
        <p className="mb-3 text-sm text-zinc-600">請求、書類、証跡管理</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {docsAndCost.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-1 text-base font-semibold text-zinc-800">拡張・追加可能</h2>
        <p className="mb-3 text-sm text-zinc-600">
          将来の機能追加や連携を示すエリア
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {expandableCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
