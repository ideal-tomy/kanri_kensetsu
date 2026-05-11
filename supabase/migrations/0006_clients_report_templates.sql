-- 取引先（報告書テンプレの既定宛先用・§4 で拡張予定）／報告書テンプレ・出力履歴

ALTER TABLE sites ADD COLUMN IF NOT EXISTS address TEXT;

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_name TEXT,
  client_type TEXT NOT NULL DEFAULT 'general_contractor',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_company ON clients(company_id);

CREATE TABLE IF NOT EXISTS report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  layout_html TEXT,
  base_file_url TEXT,
  default_recipient_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  default_recipient_emails TEXT[],
  submission_schedule TEXT,
  submission_day TEXT,
  submission_time TIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_templates_company ON report_templates(company_id);

CREATE TABLE IF NOT EXISTS report_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES report_templates(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  period_start DATE,
  period_end DATE,
  pdf_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  sent_to_emails TEXT[],
  generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_outputs_site_period ON report_outputs(site_id, period_start DESC);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_outputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_company_isolation" ON clients
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "report_templates_company_isolation" ON report_templates
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "report_outputs_company_isolation" ON report_outputs
  FOR ALL USING (
    site_id IN (
      SELECT id FROM sites WHERE company_id IN (
        SELECT company_id FROM users WHERE auth_id = auth.uid()
      )
    )
  );
