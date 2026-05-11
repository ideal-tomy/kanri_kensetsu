import { redirect } from "next/navigation";

/** 旧デモパス。ワーカー向けトークへ統合（実装指示書 §2.5） */
export default function ReportChatLegacyRedirect() {
  redirect("/m/worker/chat");
}
