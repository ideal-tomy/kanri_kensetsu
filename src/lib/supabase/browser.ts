"use client";

import { createBrowserClient } from "@supabase/ssr";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./config";

/**
 * Client Component 用の Supabase クライアント。
 * 環境変数未設定の場合は null を返す。Realtime購読も呼び出し側で null チェック必須。
 */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
