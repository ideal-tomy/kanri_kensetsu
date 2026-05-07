/**
 * DB アブストラクション層のエントリポイント。
 *
 * Phase 1: prototype-store の関数をそのまま再エクスポート。
 * Phase 2: ここの import 元を順次 Supabase 版に切り替えていく。
 *
 * ページ側は `@/lib/db` から取得するように移行することで、
 * 1ファイル単位で安全に Supabase 化できる。
 */

export { getPhotoReportsForUser, shadowInsertPhotoReport } from "./photo-reports";

export {
  state,
  getSitesForUser,
  getTasksForUser,
  getReportsForUser,
  getAssignmentsForUser,
} from "@/lib/prototype-store";

export type {
  PhotoReport,
  PhotoCategory,
  Site,
  Task,
  TaskStatus,
  Assignment,
  AssignmentStatus,
  Report,
} from "@/lib/prototype-store";
