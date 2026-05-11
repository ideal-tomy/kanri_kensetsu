-- 工程管理（実装指示書 §3.3）
-- photo_reports にタスク紐付け（自動進捗用）

ALTER TABLE photo_reports
  ADD COLUMN IF NOT EXISTS task_id UUID REFERENCES tasks(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_photo_reports_task ON photo_reports(task_id);

CREATE TABLE IF NOT EXISTS project_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  color TEXT,
  planned_start_date DATE,
  planned_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  progress_pct SMALLINT NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  progress_mode TEXT NOT NULL DEFAULT 'auto',
  notes TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_phases_site ON project_phases(site_id, display_order);

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS phase_id UUID REFERENCES project_phases(id) ON DELETE SET NULL;

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS auto_progress_source TEXT NOT NULL DEFAULT 'manual';

CREATE OR REPLACE VIEW phase_progress_summary AS
SELECT
  p.id AS phase_id,
  p.site_id,
  p.name AS phase_name,
  p.planned_start_date,
  p.planned_end_date,
  COUNT(t.id) AS total_tasks,
  COUNT(t.id) FILTER (WHERE t.status = 'completed') AS completed_tasks,
  COUNT(t.id) FILTER (WHERE t.status = 'in_progress') AS in_progress_tasks,
  COUNT(t.id) FILTER (WHERE t.status = 'paused') AS paused_tasks,
  CASE
    WHEN COUNT(t.id) = 0 THEN 0
    WHEN p.progress_mode = 'manual' THEN p.progress_pct
    ELSE LEAST(
      100,
      GREATEST(
        0,
        ROUND(
          SUM(COALESCE(t.actual_qty, 0)) / NULLIF(SUM(t.planned_qty), 0) * 100
        )::INTEGER
      )
    )
  END AS calculated_progress
FROM project_phases p
LEFT JOIN tasks t ON t.phase_id = p.id
GROUP BY p.id, p.site_id, p.name, p.planned_start_date, p.planned_end_date, p.progress_mode, p.progress_pct;

ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_phases_company_isolation" ON project_phases
  FOR ALL USING (
    site_id IN (
      SELECT id FROM sites WHERE company_id IN (
        SELECT company_id FROM users WHERE auth_id = auth.uid()
      )
    )
  );
