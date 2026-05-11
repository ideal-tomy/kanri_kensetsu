import Link from "next/link";
import { Building2 } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import {
  clientTypeLabel,
  masterClients,
} from "@/data/mock/clients-master";

export default function MasterClientsPage() {
  return (
    <PageShell
      mode="admin"
      title="取引先"
      subtitle="発注元（元請・手配会社など）の一覧（デモデータ）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "マスタ" },
        { label: "取引先" },
      ]}
    >
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-bold text-zinc-900">名前</th>
              <th className="px-4 py-3 font-bold text-zinc-900">種別</th>
              <th className="px-4 py-3 font-bold text-zinc-900">担当</th>
              <th className="px-4 py-3 font-bold text-zinc-900 text-right">案件数</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {masterClients.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/master/clients/${encodeURIComponent(c.id)}`}
                    className="font-semibold text-primary underline"
                  >
                    {c.name}
                  </Link>
                  <p className="text-xs text-zinc-500">{c.shortName}</p>
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {clientTypeLabel[c.clientType]}
                </td>
                <td className="px-4 py-3 text-zinc-700">{c.contactPerson}</td>
                <td className="px-4 py-3 text-right font-bold text-zinc-900">
                  {c.projectCount} 件
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
        <Building2 className="h-4 w-4" />
        Supabase の clients テーブルと同期する際はマイグレーションを適用し、この一覧を API から読み込むよう差し替えます。
      </p>
    </PageShell>
  );
}
