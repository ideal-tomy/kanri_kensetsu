import Link from "next/link";

export default function AdminPersonnelPage() {
  return (
    <main className="p-4 md:p-8">
      <h1 className="text-2xl font-bold">人員配置</h1>
      <p className="mt-2 text-zinc-600">週カレンダー型のフル機能は既存の配員画面を利用します。</p>
      <Link href="/admin/assignments" className="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-white">
        配員画面を開く
      </Link>
    </main>
  );
}
