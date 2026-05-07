import { cookies } from "next/headers";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { createClient as createDirectClient } from "@supabase/supabase-js";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
  isSupabaseServerWriteable,
} from "./config";

/**
 * Server Component / Route Handler 用の Supabase クライアント。
 * 環境変数未設定の場合は null を返す（呼び出し側で prototype-store にフォールバック）。
 */
export async function createServerClient() {
  if (!isSupabaseConfigured) return null;
  const jar = await cookies();
  return createSSRClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return jar.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            jar.set(name, value, options);
          }
        } catch {
          // Server Component から呼ばれる場合は set が無効なため握りつぶす
        }
      },
    },
  });
}

/**
 * shadow write 用のサービスロールクライアント。RLS を無視するので注意。
 * Route Handler 内でだけ使うこと。
 */
export function createServiceRoleClient() {
  if (!isSupabaseServerWriteable) return null;
  return createDirectClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
