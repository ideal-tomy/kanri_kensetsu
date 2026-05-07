import Link from "next/link";

export default function AdminReportsPage() {
  return (
    <main className="p-4 md:p-8">
      <h1 className="text-2xl font-bold">全日報集約</h1>
      <p className="mt-2 text-zinc-600">既存の日報確認画面に統合しています。</p>
      <Link href="/admin/field-reports" className="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-white">
        日報確認へ
      </Link>
    </main>
  );
}
