import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import {
  clientTypeLabel,
  masterClients,
} from "@/data/mock/clients-master";

export default async function MasterClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = masterClients.find((row) => row.id === id);
  if (!c) notFound();

  return (
    <PageShell
      mode="admin"
      title={c.name}
      subtitle={clientTypeLabel[c.clientType]}
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "取引先", href: "/admin/master/clients" },
        { label: c.shortName },
      ]}
    >
      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-zinc-900">連絡先</h2>
        <dl className="mt-2 grid gap-2 text-sm text-zinc-800">
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">担当</dt>
            <dd>{c.contactPerson}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">メール</dt>
            <dd>{c.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">電話</dt>
            <dd>{c.phone}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-zinc-900">契約・報告</h2>
        <p className="mt-2 text-sm text-zinc-800">支払条件: {c.paymentTerms}</p>
        {c.defaultReportTemplateName ? (
          <p className="mt-1 text-sm text-zinc-800">
            標準報告書テンプレ: {c.defaultReportTemplateName}
          </p>
        ) : null}
        <p className="mt-2 text-sm text-zinc-800">関連案件（参考）: {c.projectCount} 件</p>
      </section>

      {c.notes ? (
        <section className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-800">
          <strong className="text-zinc-900">メモ</strong>
          <p className="mt-1">{c.notes}</p>
        </section>
      ) : null}

      <p className="mt-6">
        <Link href="/admin/master/clients" className="text-sm font-semibold text-primary underline">
          一覧へ戻る
        </Link>
      </p>
    </PageShell>
  );
}
