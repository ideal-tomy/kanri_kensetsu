-- v1.1 追加機能①：出来高（数値による進捗管理）
-- 現状コードはインメモリの prototype-store で動作中。
-- 本ファイルは Supabase 接続後に `supabase db push` で反映する想定の同梱SQL。

-- 単位（枚 / m² / 本 / m / 箇所 / ㎥ など）と、予定数・実績数・今日の予定数を保持する。
-- progress_pct は actual_qty / planned_qty * 100 で算出する値（書き込みはサーバーで自動）。

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS unit TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS planned_qty NUMERIC;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS actual_qty NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS today_target_qty NUMERIC;

-- task_updates に「このupdateで何個進めたか」「update後の累計」を追加
ALTER TABLE task_updates ADD COLUMN IF NOT EXISTS qty_delta NUMERIC;
ALTER TABLE task_updates ADD COLUMN IF NOT EXISTS qty_after NUMERIC;
