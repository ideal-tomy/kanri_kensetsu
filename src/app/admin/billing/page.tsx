import { PageShell } from "@/components/layout/page-shell";
import { revenueForecasts } from "@/data/mock";
import { projects } from "@/data/mock/projects";
import { formatCurrency } from "@/lib/format";

export default function BillingPage() {
  return (
    <PageShell
      mode="admin"
      title="請求見込み"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "請求見込み" },
      ]}
    >
      <div className="space-y-3">
        {revenueForecasts.map((item) => {
          const project = projects.find((p) => p.id === item.projectId);
          return (
            <div key={item.id} className="rounded-lg border border-zinc-200 bg-white p-4">
              <p className="font-semibold">{project?.projectName}</p>
              <p className="text-sm text-zinc-600">
                {item.month} 見込み: {formatCurrency(item.forecastAmount)}
              </p>
              <p className="text-sm text-zinc-600">
                信頼度: {Math.round(item.confidence * 100)}%
              </p>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
