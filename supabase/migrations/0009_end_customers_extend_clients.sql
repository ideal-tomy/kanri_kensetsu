-- 顧客管理 B2B2C（実装指示書 §4.2）— 取引先拡張と施主テーブル

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS representative TEXT,
  ADD COLUMN IF NOT EXISTS contact_person TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS payment_terms TEXT,
  ADD COLUMN IF NOT EXISTS default_report_template_id UUID REFERENCES report_templates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS default_report_recipient_emails TEXT[],
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS end_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  customer_type TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  postal_code TEXT,
  address TEXT,
  total_projects_count INTEGER DEFAULT 0,
  last_project_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_end_customers_company ON end_customers(company_id);

ALTER TABLE end_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "end_customers_company_isolation" ON end_customers
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE auth_id = auth.uid()
    )
  );
