/**
 * メッセージ HOT→WARM アーカイブ（実装指示書 §2.4）
 *
 * Supabase Edge Functions で `archive-messages` としてデプロイし、
 * Scheduled Functions（日次）から叩く想定です。
 */
Deno.serve(async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      message:
        "プレースホルダ: 本番では retention を読み、対象メッセージを Storage に退避後 DELETE してください。",
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});
