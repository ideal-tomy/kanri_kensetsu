-- v1.1 追加機能③：現場全体の進捗（手動入力）
-- 日々のタスク進捗とは独立。監督が「現場まるごと何%」を手で入れる。
-- ログを取ることで、月次レポートで「2ヶ月で30→60%に進んだ」を語れるようにする。

ALTER TABLE sites
  ADD COLUMN IF NOT EXISTS overall_progress INTEGER NOT NULL DEFAULT 0
  CHECK (overall_progress BETWEEN 0 AND 100);

CREATE TABLE IF NOT EXISTS site_progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  progress_from INTEGER,
  progress_to INTEGER NOT NULL CHECK (progress_to BETWEEN 0 AND 100),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_progress_logs_site_date
  ON site_progress_logs(site_id, created_at DESC);
