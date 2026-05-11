/**
 * デモ用インメモリ・チャット（prototype-store と同様）。
 * Supabase 未設定またはフォールバック時に API が利用する。
 */
import type { ChatAttachment, ChatMessage, ChatThreadPreview } from "@/lib/chat/types";
import type { SessionUser } from "@/lib/auth/session";

let seq = 1;
const nextId = () => `msg-${Date.now()}-${seq++}`;

const messages: ChatMessage[] = [];
const reads: Array<{ message_id: string; user_id: string; read_at: string }> = [];

/** デモシード（初回のみ） */
let seeded = false;

function seedDemo(siteIds: { id: string; name: string }[]) {
  if (seeded || siteIds.length === 0) return;
  seeded = true;
  const t = new Date().toISOString();
  const m1: ChatMessage = {
    id: nextId(),
    site_id: siteIds[0].id,
    sender_id: "demo-supervisor",
    sender_name: "伊藤監督",
    body: "おはようございます。今日は南側足場の確認をお願いします。",
    message_type: "text",
    attachments: [],
    parent_message_id: null,
    is_pinned: true,
    pinned_at: t,
    is_important: true,
    reactions: {},
    deleted_at: null,
    created_at: t,
  };
  messages.push(m1);
}

export function getMessagesForSite(siteId: string): ChatMessage[] {
  return messages
    .filter((m) => m.site_id === siteId && !m.deleted_at)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function countPins(siteId: string): number {
  return messages.filter((m) => m.site_id === siteId && m.is_pinned && !m.deleted_at).length;
}

export function addMessage(input: {
  siteId: string;
  user: SessionUser;
  body: string | null;
  message_type?: ChatMessage["message_type"];
  attachments?: ChatAttachment[];
  mentions?: string[];
}): ChatMessage {
  const now = new Date().toISOString();
  const msg: ChatMessage = {
    id: nextId(),
    site_id: input.siteId,
    sender_id: input.user.id,
    sender_name: input.user.name,
    body: input.body,
    message_type: input.message_type ?? "text",
    attachments: input.attachments ?? [],
    parent_message_id: null,
    is_pinned: false,
    pinned_at: null,
    is_important: false,
    reactions: {},
    deleted_at: null,
    created_at: now,
  };
  messages.push(msg);
  return msg;
}

export function toggleReaction(messageId: string, emoji: string, userId: string): ChatMessage | null {
  const m = messages.find((x) => x.id === messageId);
  if (!m || m.deleted_at) return null;
  const cur = { ...m.reactions };
  const users = new Set(cur[emoji] ?? []);
  if (users.has(userId)) users.delete(userId);
  else users.add(userId);
  cur[emoji] = Array.from(users);
  if (cur[emoji].length === 0) delete cur[emoji];
  m.reactions = cur;
  return m;
}

export function togglePin(
  siteId: string,
  messageId: string,
): { ok: true; message: ChatMessage } | { ok: false; reason: string } {
  const m = messages.find((x) => x.id === messageId && x.site_id === siteId);
  if (!m || m.deleted_at) return { ok: false, reason: "not_found" };
  if (!m.is_pinned && countPins(siteId) >= 5) {
    return { ok: false, reason: "pin_limit" };
  }
  m.is_pinned = !m.is_pinned;
  m.pinned_at = m.is_pinned ? new Date().toISOString() : null;
  return { ok: true, message: m };
}

export function markRead(siteId: string, userId: string, upToMessageId?: string) {
  const list = getMessagesForSite(siteId);
  const cutoff = upToMessageId ? list.findIndex((m) => m.id === upToMessageId) : list.length - 1;
  const slice = cutoff >= 0 ? list.slice(0, cutoff + 1) : list;
  for (const m of slice) {
    if (m.sender_id === userId) continue;
    const exists = reads.some((r) => r.message_id === m.id && r.user_id === userId);
    if (!exists) {
      reads.push({
        message_id: m.id,
        user_id: userId,
        read_at: new Date().toISOString(),
      });
    }
  }
}

export function unreadCount(siteId: string, userId: string): number {
  const list = getMessagesForSite(siteId);
  return list.filter((m) => {
    if (m.sender_id === userId) return false;
    return !reads.some((r) => r.message_id === m.id && r.user_id === userId);
  }).length;
}

export function lastReadMessageId(siteId: string, userId: string): string | undefined {
  const list = getMessagesForSite(siteId);
  let last: string | undefined;
  for (const m of list) {
    if (m.sender_id === userId) continue;
    if (reads.some((r) => r.message_id === m.id && r.user_id === userId)) last = m.id;
  }
  return last;
}

export function buildThreadPreviews(
  siteRows: { id: string; name: string }[],
  viewer: SessionUser,
): ChatThreadPreview[] {
  seedDemo(siteRows);
  const rows = siteRows.map((s) => {
    const list = getMessagesForSite(s.id);
    const last = list[list.length - 1];
    return {
      site_id: s.id,
      site_name: s.name,
      last_body: last?.body ?? last?.attachments[0]?.name ?? null,
      last_at: last?.created_at ?? "",
      unread_count: unreadCount(s.id, viewer.id),
    };
  });
  rows.sort((a, b) => {
    if (a.unread_count !== b.unread_count) return b.unread_count - a.unread_count;
    return (b.last_at || "").localeCompare(a.last_at || "");
  });
  return rows;
}
