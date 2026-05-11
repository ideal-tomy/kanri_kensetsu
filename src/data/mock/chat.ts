import type { ChatMessage, ChatThread } from "@/types/domain";

export const chatThreads: ChatThread[] = [
  {
    id: "ct1",
    projectId: "p1",
    title: "新宿A棟 現場連絡",
    updatedAt: "2026-04-29T11:20:00+09:00",
  },
  {
    id: "ct2",
    projectId: "p2",
    title: "大手町改修 品質・日程",
    updatedAt: "2026-04-29T09:45:00+09:00",
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "cm1",
    threadId: "ct1",
    authorLabel: "事務所（調整）",
    body: "3F建具の搬入、午後枠で確定で問題ないでしょうか。",
    sentAt: "2026-04-29T08:05:00+09:00",
    side: "office",
  },
  {
    id: "cm2",
    threadId: "ct1",
    authorLabel: "現場（職長）",
    body: "午後13時着でお願いします。搬入路は南ゲート利用で共有済みです。",
    sentAt: "2026-04-29T08:12:00+09:00",
    side: "field",
  },
  {
    id: "cm3",
    threadId: "ct2",
    authorLabel: "事務所（品質）",
    body: "是正写真を共有いただけますか。不具合アラートと突合します。",
    sentAt: "2026-04-29T09:40:00+09:00",
    side: "office",
  },
];
