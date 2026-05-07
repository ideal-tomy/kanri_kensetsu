/**
 * Supabase 接続情報。環境変数が未設定でもビルドは通る（デモは prototype-store のみで動く）。
 * 値が両方揃っているときだけ shadow write / 読み込み切替が有効になる。
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const isSupabaseServerWriteable = Boolean(
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY,
);
