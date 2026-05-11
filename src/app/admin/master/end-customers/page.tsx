import { PageShell } from "@/components/layout/page-shell";
import { masterEndCustomers } from "@/data/mock/clients-master";

export default function MasterEndCustomersPage() {
  return (
    <PageShell
      mode="admin"
      title="施主"
      subtitle="最終顧客（任意運用・デモデータ）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "マスタ" },
        { label: "施主" },
      ]}
    >
      <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white shadow-sm">
        {masterEndCustomers.map((row) => (
          <li key={row.id} className="px-4 py-3">
            <p className="font-bold text-zinc-900">{row.name}</p>
            <p className="text-xs text-zinc-500">
              {row.customerType === "individual" ? "個人" : "法人"}
              {row.address ? ` · ${row.address}` : ""}
            </p>
            {row.contactPerson ? (
              <p className="mt-1 text-sm text-zinc-700">担当: {row.contactPerson}</p>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-zinc-500">
        案件登録時は「施主を登録しない／名前のみ／詳細登録」を選べるUIを別途案件フォームに追加できます。
      </p>
    </PageShell>
  );
}
