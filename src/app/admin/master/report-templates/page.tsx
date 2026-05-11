import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { listTemplates } from "@/lib/report/templates-repository";

export default async function ReportTemplatesListPage() {
  const templates = await listTemplates();

  return (
    <PageShell
      mode="admin"
      title="報告書テンプレ"
      subtitle="顧客フォーマットに合わせた出力定義（一覧・新規）"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "マスタ", href: "/admin/master/report-templates" },
        { label: "報告書テンプレ" },
      ]}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-600">
          サンプル3種は常に利用できます。Supabase に保存したテンプレは一覧にマージされます。
        </p>
        <Link
          href="/admin/master/report-templates/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          新規作成
        </Link>
      </div>

      <ul className="mt-6 space-y-2">
        {templates.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-bold text-zinc-900">{t.name}</p>
              <p className="text-xs text-zinc-500">
                {t.category ?? "—"} ·{" "}
                {t.is_active ? "有効" : "無効"}
              </p>
              {t.description ? (
                <p className="mt-1 text-sm text-zinc-700">{t.description}</p>
              ) : null}
            </div>
            <Link
              href={`/admin/master/report-templates/${t.id}`}
              className="text-sm font-semibold text-primary"
            >
              詳細
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700">
        <p className="flex items-center gap-2 font-bold text-zinc-900">
          <FileText className="h-4 w-4" />
          顧客テンプレ取り込み
        </p>
        <p className="mt-1">
          手順の詳細はリポジトリの{" "}
          <code className="rounded bg-zinc-200 px-1">docs/template-import-guide.md</code>{" "}
          を参照してください。
        </p>
      </section>
    </PageShell>
  );
}
