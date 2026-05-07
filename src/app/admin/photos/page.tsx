import Link from "next/link";

export default function AdminPhotosPage() {
  return (
    <main className="p-4 md:p-8">
      <h1 className="text-2xl font-bold">全写真集約</h1>
      <Link href="/admin/reports/photos" className="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-white">
        写真一覧へ
      </Link>
    </main>
  );
}
