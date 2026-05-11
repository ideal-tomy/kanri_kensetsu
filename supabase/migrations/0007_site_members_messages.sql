-- 現場メンバー・トーク（実装指示書 §2.3）
-- Storage バケット message-archives（アーカイブ gzip 用）

CREATE TABLE IF NOT EXISTS site_members (
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (site_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_site_members_user ON site_members(user_id);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  body TEXT,
  message_type TEXT NOT NULL DEFAULT 'text',
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  pinned_at TIMESTAMPTZ,
  is_important BOOLEAN NOT NULL DEFAULT FALSE,
  reactions JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_site_created ON messages(site_id, created_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_messages_pinned ON messages(site_id)
  WHERE is_pinned = TRUE AND deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS message_reads (
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (message_id, user_id)
);

CREATE TABLE IF NOT EXISTS message_mentions (
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  mentioned_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notified_at TIMESTAMPTZ,
  PRIMARY KEY (message_id, mentioned_user_id)
);

CREATE TABLE IF NOT EXISTS message_retention_policies (
  company_id UUID PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
  hot_days INTEGER NOT NULL DEFAULT 30,
  warm_days INTEGER NOT NULL DEFAULT 90,
  delete_after INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (endpoint)
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);

ALTER TABLE site_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_members_company_isolation" ON site_members
  FOR ALL USING (
    site_id IN (
      SELECT id FROM sites WHERE company_id IN (
        SELECT company_id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

CREATE POLICY "messages_company_isolation" ON messages
  FOR ALL USING (
    site_id IN (
      SELECT id FROM sites WHERE company_id IN (
        SELECT company_id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

CREATE POLICY "message_reads_company_isolation" ON message_reads
  FOR ALL USING (
    message_id IN (
      SELECT id FROM messages WHERE site_id IN (
        SELECT id FROM sites WHERE company_id IN (
          SELECT company_id FROM users WHERE auth_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "message_mentions_company_isolation" ON message_mentions
  FOR ALL USING (
    message_id IN (
      SELECT id FROM messages WHERE site_id IN (
        SELECT id FROM sites WHERE company_id IN (
          SELECT company_id FROM users WHERE auth_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "message_retention_company_isolation" ON message_retention_policies
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "push_subscriptions_self" ON push_subscriptions
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('message-archives', 'message-archives', FALSE, 52428800)
ON CONFLICT (id) DO NOTHING;
