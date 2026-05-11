export type MessageType = "text" | "photo" | "file" | "system";

export type ChatAttachment = {
  type: string;
  url: string;
  name?: string;
  size?: number;
};

/** メモリストア／Supabase 共通のメッセージ形 */
export type ChatMessage = {
  id: string;
  site_id: string;
  sender_id: string;
  sender_name: string;
  body: string | null;
  message_type: MessageType;
  attachments: ChatAttachment[];
  parent_message_id: string | null;
  is_pinned: boolean;
  pinned_at: string | null;
  is_important: boolean;
  reactions: Record<string, string[]>;
  deleted_at: string | null;
  created_at: string;
};

export type ChatThreadPreview = {
  site_id: string;
  site_name: string;
  last_body: string | null;
  last_at: string;
  unread_count: number;
};
