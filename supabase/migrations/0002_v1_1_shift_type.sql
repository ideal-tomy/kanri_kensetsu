-- v1.1 追加機能②：週カレンダー型 人員配置（夜勤対応）
-- shift_type ENUM を「日勤・夜勤×全日／前半／後半」の6値に拡張する。
--
-- 注意：DROP TYPE ... CASCADE は assignments.shift カラムを削除するため、
-- 本番運用では必ず以下の手順をとること。
--   1) assignments.shift を TEXT に一旦退避（ALTER COLUMN ... TYPE TEXT USING shift::text）
--   2) DROP TYPE shift_type CASCADE; CREATE TYPE shift_type AS ENUM (...)
--   3) UPDATE assignments SET shift = 'day_full' WHERE shift = 'full';
--      UPDATE assignments SET shift = 'day_am'   WHERE shift = 'am';
--      UPDATE assignments SET shift = 'day_pm'   WHERE shift = 'pm';
--   4) ALTER TABLE assignments ALTER COLUMN shift TYPE shift_type USING shift::shift_type;
--
-- 開発環境のリセット用には以下の簡易スクリプトでよい。

-- 既存データの退避（カラムをTEXTに変換）
ALTER TABLE assignments ALTER COLUMN shift DROP DEFAULT;
ALTER TABLE assignments ALTER COLUMN shift TYPE TEXT USING shift::text;

DROP TYPE IF EXISTS shift_type CASCADE;

CREATE TYPE shift_type AS ENUM (
  'day_full',     -- 日勤・1日
  'day_am',       -- 日勤・午前のみ
  'day_pm',       -- 日勤・午後のみ
  'night_full',   -- 夜勤・1晩
  'night_early',  -- 夜勤・前半
  'night_late'    -- 夜勤・後半
);

-- 既存データのマッピング（旧 'full'/'am'/'pm' → 新 'day_full'/'day_am'/'day_pm'）
UPDATE assignments SET shift = 'day_full' WHERE shift = 'full';
UPDATE assignments SET shift = 'day_am'   WHERE shift = 'am';
UPDATE assignments SET shift = 'day_pm'   WHERE shift = 'pm';

-- カラムを ENUM に戻す
ALTER TABLE assignments
  ALTER COLUMN shift TYPE shift_type USING shift::shift_type;
ALTER TABLE assignments
  ALTER COLUMN shift SET DEFAULT 'day_full';
