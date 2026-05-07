import { Crown, HardHat, ShieldCheck, UserCog } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { StatCard } from "@/components/viz/StatCard";
import { FutureFeatureBadge } from "@/components/common/FutureFeatureBadge";
import { ADMIN_COLORS } from "@/lib/admin-theme";
import { demoAccounts } from "@/lib/prototype-store";

const ROLE_LABEL: Record<string, string> = {
  worker: "作業員",
  supervisor: "現場監督",
  admin: "内勤管理",
  owner: "経営者",
};

const ROLE_COLOR: Record<string, string> = {
  worker: ADMIN_COLORS.primary,
  supervisor: ADMIN_COLORS.status.inProgress,
  admin: ADMIN_COLORS.status.completed,
  owner: ADMIN_COLORS.severity.warning,
};

const ROLE_ICON: Record<string, typeof HardHat> = {
  worker: HardHat,
  supervisor: ShieldCheck,
  admin: UserCog,
  owner: Crown,
};

export default function AdminMembersPage() {
  const breakdown = demoAccounts.reduce<Record<string, number>>((acc, a) => {
    acc[a.role] = (acc[a.role] ?? 0) + 1;
    return acc;
  }, {});

  const donutData = Object.entries(breakdown).map(([k, v]) => ({
    name: ROLE_LABEL[k] ?? k,
    value: v,
    color: ROLE_COLOR[k],
  }));

  return (
    <PageShell
      mode="admin"
      title="メンバー管理"
      subtitle="ロール・招待・権限管理（デモ）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "メンバー" },
      ]}
    >
      <section className="grid gap-3 md:grid-cols-4">
        <StatCard
          label="メンバー総数"
          value={demoAccounts.length}
          unit="名"
        />
        <StatCard
          label="管理者"
          value={breakdown.admin ?? 0}
          unit="名"
          icon={UserCog}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
        />
        <StatCard
          label="監督"
          value={breakdown.supervisor ?? 0}
          unit="名"
          icon={ShieldCheck}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          label="作業員"
          value={breakdown.worker ?? 0}
          unit="名"
          icon={HardHat}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="ロール別 内訳">
          <DonutChart
            data={donutData}
            centerLabel="名"
            centerValue={`${demoAccounts.length}`}
          />
        </ChartCard>

        <ChartCard title="メンバー一覧" subtitle="デモアカウント" className="lg:col-span-2">
          <ul className="space-y-2">
            {demoAccounts.map((account) => {
              const Icon = ROLE_ICON[account.role] ?? UserCog;
              return (
                <li
                  key={`${account.companyCode}-${account.name}`}
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3"
                >
                  <div
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: ROLE_COLOR[account.role] ?? ADMIN_COLORS.primary }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-zinc-900">{account.name}</p>
                    <p className="text-xs text-zinc-500">
                      {ROLE_LABEL[account.role] ?? account.role} ・ {account.label}
                    </p>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                    {account.companyCode}
                  </span>
                </li>
              );
            })}
          </ul>
        </ChartCard>
      </section>

      <section className="mt-6">
        <FutureFeatureBadge
          label="将来実装予定 — 招待・権限変更"
          description="Supabase Auth 接続後に、メールアドレスからの招待と権限変更 UI を追加します。"
        >
          <div className="space-y-2 p-4 text-sm text-zinc-600">
            <p>・メール招待リンク発行（招待トークン）</p>
            <p>・ロール変更ログ・最終ログイン時刻</p>
            <p>・SSO（Google / Microsoft）</p>
          </div>
        </FutureFeatureBadge>
      </section>
    </PageShell>
  );
}
