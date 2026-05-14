import { notFound, redirect } from "next/navigation";
import { getViewSession } from "@/lib/auth/preview";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { getSitesForUser, state } from "@/lib/prototype-store";

export default async function WorkerChatSitePage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { user } = await getViewSession("worker");
  if (!user) redirect("/login");
  if (user.role !== "worker") redirect("/m/supervisor/chat");

  const { siteId: raw } = await params;
  const siteId = decodeURIComponent(raw);
  const allowed = getSitesForUser(user).some((s) => s.id === siteId);
  if (!allowed) notFound();

  const site = state.sites.find((s) => s.id === siteId);
  if (!site) notFound();

  return (
    <ChatRoom
      siteId={site.id}
      siteName={site.name}
      backHref="/m/worker/chat"
      currentUserId={user.id}
    />
  );
}
