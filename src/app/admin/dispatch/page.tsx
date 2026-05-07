import { Calendar, Handshake } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { KanbanBoard, type KanbanColumnDef } from "@/components/viz/KanbanBoard";
import { StatCard } from "@/components/viz/StatCard";
import { ADMIN_COLORS } from "@/lib/admin-theme";
import { dispatchProgresses, projects } from "@/data/mock";

const STATUS_LABEL: Record<string, string> = {
  not_started: "未着手",
  in_progress: "進行中",
  follow_required: "要フォロー",
  done: "完了",
};

const STATUS_COLOR: Record<string, string> = {
  not_started: ADMIN_COLORS.status.notStarted,
  in_progress: ADMIN_COLORS.status.inProgress,
  follow_required: ADMIN_COLORS.status.paused,
  done: ADMIN_COLORS.status.completed,
};

const COLUMNS: Array<{ id: string; label: string }> = [
  { id: "not_started", label: STATUS_LABEL.not_started },
  { id: "in_progress", label: STATUS_LABEL.in_progress },
  { id: "follow_required", label: STATUS_LABEL.follow_required },
  { id: "done", label: STATUS_LABEL.done },
];

interface DispatchCard {
  id: string;
  projectName: string;
  category: string;
  status: string;
  dueDate: string;
  note?: string;
}

export default function DispatchPage() {
  const cards: DispatchCard[] = dispatchProgresses.map((d) => ({
    id: d.id,
    projectName:
      projects.find((p) => p.id === d.projectId)?.projectName ?? "（不明）",
    category: d.category,
    status: d.status,
    dueDate: d.dueDate,
    note: d.note,
  }));

  const columns: KanbanColumnDef<DispatchCard>[] = COLUMNS.map((col) => ({
    id: col.id,
    label: col.label,
    accent: STATUS_COLOR[col.id],
    items: cards.filter((c) => c.status === col.id),
  }));

  const breakdown = cards.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});

  const donutData = COLUMNS.map((col) => ({
    name: col.label,
    value: breakdown[col.id] ?? 0,
    color: STATUS_COLOR[col.id],
  })).filter((d) => d.value > 0);

  const followCount = breakdown.follow_required ?? 0;
  const inProgressCount = breakdown.in_progress ?? 0;

  return (
    <PageShell
      mode="admin"
      title="現場手配進捗"
      subtitle="材料・人員・安全のステータスをカンバンで管理"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "現場手配進捗" },
      ]}
    >
      <section className="grid gap-3 md:grid-cols-3">
        <StatCard
          label="手配中"
          value={inProgressCount}
          unit="件"
          icon={Handshake}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="要フォロー"
          value={followCount}
          unit="件"
          icon={Calendar}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
          highlight={followCount > 0 ? "warning" : "default"}
        />
        <StatCard
          label="完了"
          value={breakdown.done ?? 0}
          unit="件"
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="ステータス内訳">
          <DonutChart
            data={donutData}
            centerLabel="件"
            centerValue={`${cards.length}`}
          />
        </ChartCard>
        <ChartCard title="手配カンバン" className="lg:col-span-2">
          <KanbanBoard
            columns={columns}
            renderItem={(card) => (
              <>
                <p className="text-sm font-bold text-zinc-900">{card.projectName}</p>
                <p className="text-xs text-zinc-500">
                  {card.category} ・ 期限 {card.dueDate}
                </p>
                {card.note ? (
                  <p className="mt-1 text-xs text-zinc-700">{card.note}</p>
                ) : null}
              </>
            )}
          />
        </ChartCard>
      </section>
    </PageShell>
  );
}
