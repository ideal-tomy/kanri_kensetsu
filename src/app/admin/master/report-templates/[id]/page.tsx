import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { getTemplateById } from "@/lib/report/templates-repository";

export default async function ReportTemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = await getTemplateById(id);
  if (!template) notFound();

  return (
    <PageShell
      mode="admin"
      title={template.name}
      subtitle="テンプレ定義の確認"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "報告書テンプレ", href: "/admin/master/report-templates" },
        { label: template.name },
      ]}
    >
      <dl className="grid gap-3 text-sm">
        <div>
          <dt className="text-zinc-500">カテゴリ</dt>
          <dd className="font-medium text-zinc-900">{template.category ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">説明</dt>
          <dd className="font-medium text-zinc-900">{template.description ?? "—"}</dd>
        </div>
      </dl>

      <section className="mt-6">
        <h2 className="text-sm font-bold text-zinc-900">fields（JSON）</h2>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-zinc-100">
          {JSON.stringify(template.fields, null, 2)}
        </pre>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-bold text-zinc-900">レイアウト HTML（抜粋）</h2>
        <pre className="mt-2 max-h-64 overflow-auto rounded-lg border border-zinc-200 bg-white p-4 text-xs text-zinc-800">
          {(template.layout_html ?? "").slice(0, 2000)}
          {(template.layout_html?.length ?? 0) > 2000 ? "\n…" : ""}
        </pre>
      </section>

      <p className="mt-6">
        <Link
          href="/admin/reports/output"
          className="font-semibold text-primary underline"
        >
          報告書出力画面へ
        </Link>
      </p>
    </PageShell>
  );
}
