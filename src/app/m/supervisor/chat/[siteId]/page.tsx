import { notFound, redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth/session";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { getSitesForUser, state } from "@/lib/prototype-store";

export default async function SupervisorChatSitePage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const user = await getSessionFromCookies();
  if (!user) redirect("/login");
  if (
    user.role !== "supervisor" &&
    user.role !== "admin" &&
    user.role !== "owner"
  ) {
    redirect("/m/worker/chat");
  }

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
      backHref="/m/supervisor/chat"
      currentUserId={user.id}
    />
  );
}
