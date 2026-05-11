/**
 * 工程の自動進捗（実装指示書 §3.4）。
 *
 * Supabase 利用時は `photo_reports` と `tasks` をサービスロール／RPC で更新する。
 * 現在のデモでは `prototype-store` の `createPhotoReport` が進捗写真投稿後に
 * `photo_count` タスクへ追記し、`refreshPhasesForSite` で工程％を再計算します。
 *
 * @see createPhotoReport — prototype-store.ts
 */

export const AUTO_PROGRESS_IMPL_NOTE =
  "demo: integrated in prototype-store.createPhotoReport → applyPhotoProgressFromReport";
