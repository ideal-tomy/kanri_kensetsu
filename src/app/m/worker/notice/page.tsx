import { BottomNav } from "@/components/nav/bottom-nav";
import { getSessionFromCookies } from "@/lib/auth/session";
import { state } from "@/lib/prototype-store";

export default async function WorkerNoticePage() {
  const user = await getSessionFromCookies();
  if (!user) return null;
  const myNotifications = state.notifications.filter((item) => item.userName === user.name);

  return (
    <main className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">おしらせ</h1>
      <section className="space-y-2">
        {myNotifications.length === 0 ? <p className="text-sm text-zinc-600">おしらせはありません</p> : null}
        {myNotifications.map((item) => (
          <article key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="font-semibold">{item.title}</p>
            <p className="mt-1 text-sm text-zinc-600">{item.body}</p>
            <button className="mt-3 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white">
              了解しました
            </button>
          </article>
        ))}
      </section>
      <BottomNav role="worker" />
    </main>
  );
}
