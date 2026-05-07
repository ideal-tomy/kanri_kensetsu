import Link from "next/link";
import { state } from "@/lib/prototype-store";

export default function AdminSitesPage() {
  return (
    <main className="p-4 md:p-8">
      <h1 className="text-2xl font-bold">現場管理</h1>
      <ul className="mt-4 space-y-2">
        {state.sites.map((site) => (
          <li key={site.id} className="rounded-lg border border-zinc-200 bg-white p-4">
            <p className="font-semibold">{site.name}</p>
            <p className="text-sm text-zinc-600">全体進捗 {site.overallProgress}%</p>
            <Link href={`/admin/projects/${site.id}`} className="mt-2 inline-block text-sm text-primary underline">
              詳細を見る
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
