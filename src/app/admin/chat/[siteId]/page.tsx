import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/admin";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { state } from "@/lib/prototype-store";

export default async function AdminChatSitePage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const user = await requireAdminSession();
  const { siteId: raw } = await params;
  const siteId = decodeURIComponent(raw);

  const site = state.sites.find((s) => s.id === siteId && s.companyCode === user.companyCode);
  if (!site) notFound();

  return (
    <ChatRoom
      siteId={site.id}
      siteName={site.name}
      backHref="/admin/chat"
      currentUserId={user.id}
    />
  );
}
