# Cursor向け 実装指示書｜現場ナレッジ管理ツール

> **このファイルの使い方**
> Cursorで本プロジェクトを開発する際、最初にこのファイルをエディタで開き、Cursor Chatに「このファイルを読み込んで、これに沿って開発してください」と指示する。各セクションは順番通りに実装する。
> 別ファイル `機能仕様書_v2.0.md` も合わせて参照すること。

---

## 0. プロジェクト基本情報

### 0.1 プロダクト概要

- **名称（仮）**：GENBA NOTE
- **ターゲット**：建設業の中小企業（10〜100名規模）。ITに苦手意識のある職人さん・現場監督が日常的に使う。
- **目的**：現場と事務所の情報ズレをなくす。蓄積データをナレッジ化する。
- **収益**：月額50,000円のSaaS（運用コンサル込み）

### 0.2 仮ペルソナ（開発中の意思決定基準）

開発中に「この機能、どう作るべきか」迷ったら、以下のペルソナを基準に判断する。

```yaml
契約企業: 山田建設株式会社（仮）
  業種: 戸建て住宅・リフォーム
  従業員数: 35名（職人20名、現場監督8名、内勤5名、経営2名）
  現状: LINEと紙とExcelで現場管理。情報ズレと人員調整の電話地獄が課題。
  IT習熟度: スマホでLINEと写真撮影は出来る。それ以上は厳しい。

主要ユーザー4名:
  田中さん（55歳）:
    役割: ベテラン職人（鉄筋工）
    使い方: 日報投稿と現場チャット閲覧のみ。スマホ片手で30秒以内に完結したい。
    口癖: 「字が小さいと見えん」「ボタンどれや」
  
  佐藤さん（42歳）:
    役割: 現場監督
    使い方: 日報確認、写真整理、進捗チェック、職人さんへの指示。
    悩み: 複数現場を掛け持ちで、誰がどこにいるかわからなくなる。
  
  鈴木さん（38歳）:
    役割: 人員管理者（内勤）
    使い方: 毎朝の人員配置決め、急な変更対応、各現場への連絡。
    悩み: 雨予報のたびに10人以上に電話している。
  
  山田社長（60歳）:
    役割: 経営者
    使い方: 全現場の状況をPCで眺める。月次レポートを読む。
    期待: 「会社の知恵が貯まってる感」が欲しい。
```

### 0.3 文言ポリシー（最重要）

**IT用語禁止リスト**（社内用語に置換）

| ❌ NGワード | ✅ 使う言葉 |
|------------|------------|
| ログイン | はじめる / ログイン |
| ログアウト | おわる |
| サインアップ | あたらしくはじめる |
| ダッシュボード | ホーム / トップ |
| アカウント | じぶんの設定 |
| 通知 | おしらせ |
| プッシュ通知 | おしらせ |
| メンション | よびかけ |
| アップロード | しゃしんを入れる |
| ダウンロード | ほぞん |
| アーカイブ | しまう |
| ステータス | じょうたい |
| タスク | やること |
| アサイン | 割り当て / われわり |
| インポート | とりこむ |
| エクスポート | だす |
| 同期 | あわせる（自動更新） |
| ナレッジ | かこの記録 |
| エラー | うまくいかなかった |
| バリデーション | （表示しない。代わりに具体的なメッセージ） |
| サブミット | 送る / ほぞん |
| キャンセル | やめる |
| 削除 | けす |
| ユーザー | 仲間 / メンバー |
| パスワード | あいことば（説明不要なら「パスワード」でも可） |
| ログ | きろく |

**説明文の書き方**

- 説明は**極力書かない**。書くなら一行・敬体ではなく口語。
- 例：❌「以下の項目に必要事項を入力してください。」
- 例：✅「ぜんぶ書けたら『送る』を押してね」
- ボタン文言は動詞＋目的語で具体に：「送る」ではなく「事務所に送る」、「保存」ではなく「下書きをのこす」

**エラーメッセージは具体的に、責めない**

- ❌「不正な入力です」
- ✅「メールアドレスに『@』が入ってないみたい」

### 0.4 確定事項

| 項目 | 決定 |
|------|------|
| ホスティング | **Vercel（フロント・API）+ Supabase（DB・Storage・Auth・Realtime）** |
| カラーパレット | 仕様書通り（紺#2C3E50 / オレンジ#E67E22 / 緑#27AE60 / 赤#C0392B） |
| 仮ペルソナ | 山田建設（戸建て住宅・35名）で進める |
| 音声入力 | Web Speech API（無料、ブラウザ標準） |

---

## 1. 開発環境セットアップ

### 1.1 必須ツール

```bash
# Node.js 20+ / pnpm
node -v   # v20.0.0+
pnpm -v   # 8.0.0+

# Supabase CLI
brew install supabase/tap/supabase

# Vercel CLI
pnpm add -g vercel
```

### 1.2 プロジェクト初期化

```bash
# Cursorに以下を順番に実行させる
pnpm create next-app@latest genba-note --typescript --tailwind --app --src-dir --import-alias "@/*"
cd genba-note

# 必須パッケージ
pnpm add @supabase/supabase-js @supabase/ssr
pnpm add zustand @tanstack/react-query
pnpm add zod react-hook-form @hookform/resolvers
pnpm add date-fns
pnpm add lucide-react
pnpm add web-push

# shadcn/ui
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card input textarea dialog sheet tabs badge avatar dropdown-menu toast

# 開発支援
pnpm add -D @types/node @types/react @types/react-dom
pnpm add -D prettier eslint-config-prettier
```

### 1.3 環境変数 `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Web Push（後で生成）
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@example.com
```

### 1.4 ディレクトリ構成

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx           # はじめる画面
│   │   └── join/page.tsx            # 招待コードで入る
│   ├── (app)/
│   │   ├── layout.tsx               # 共通レイアウト（下部ナビ）
│   │   ├── page.tsx                 # ホーム（現場一覧）
│   │   ├── sites/[siteId]/
│   │   │   ├── page.tsx             # 現場ダッシュボード
│   │   │   ├── reports/             # 日報
│   │   │   ├── photos/              # 写真
│   │   │   ├── chat/                # トーク
│   │   │   ├── tasks/               # 進捗
│   │   │   └── members/             # メンバー
│   │   ├── personnel/page.tsx       # 人員ボード（全社）
│   │   ├── search/page.tsx          # ナレッジ検索
│   │   └── settings/page.tsx        # 設定
│   ├── api/
│   │   ├── auth/
│   │   ├── sites/
│   │   ├── reports/
│   │   ├── tasks/
│   │   ├── assignments/
│   │   └── search/
│   └── layout.tsx                   # ルート（PWA設定含む）
├── components/
│   ├── ui/                          # shadcn/ui
│   ├── nav/                         # ナビゲーション
│   ├── report/                      # 日報関連
│   ├── task/                        # 進捗関連
│   ├── personnel/                   # 人員関連
│   └── common/                      # 共通コンポーネント
├── lib/
│   ├── supabase/                    # Supabaseクライアント
│   ├── parser/                      # 日報パーサー
│   ├── push/                        # Web Push
│   └── utils.ts
├── hooks/
├── stores/                          # Zustand
├── types/
└── styles/
```

---

## 2. 実装順序（Phase 1〜4）

> **Cursorへの指示**：必ずこの順番で実装する。各Phaseの完了確認チェックリストを満たすまで次へ進まない。

### Phase 1：基盤 + 日報（4週間）

- [ ] 1-1. Supabaseプロジェクト作成・DBスキーマ適用（§3参照）
- [ ] 1-2. 認証（メール+会社コード / 招待コード）
- [ ] 1-3. ホーム画面（現場一覧）
- [ ] 1-4. 現場作成・編集
- [ ] 1-5. 日報作成（音声入力 → パーサー → 整形プレビュー → 送信）
- [ ] 1-6. 日報一覧・詳細・PDF出力

**完了基準**：田中さん（仮ペルソナ）がスマホで音声入力 → 日報送信を30秒で完了できる。

### Phase 2：写真 + トーク + 進捗 + 人員（4週間）

- [ ] 2-1. 写真共有（撮影・タグ付け・現場別アルバム）
- [ ] 2-2. トーク（現場別チャット・ピン留め・既読）
- [ ] 2-3. **進捗管理（現場主導の入力 + 内勤確認）** ★最重要
- [ ] 2-4. **人員アサインボード（全員が見られる共通カレンダー）** ★最重要
- [ ] 2-5. 急変更対応（当日変更ボタン + プッシュ通知 + 了解返答）

**完了基準**：鈴木さん（人員管理者）が朝の30分で全現場の人員配置を完了できる。電話する必要がない。

### Phase 3：ナレッジ + 通知 + PWA化（3週間）

- [ ] 3-1. ナレッジ検索（横断全文検索）
- [ ] 3-2. PWA設定（manifest.json / Service Worker）
- [ ] 3-3. Web Push通知（VAPID鍵生成 / 購読 / 配信）
- [ ] 3-4. オフライン対応（日報下書きをIndexedDB保存）

### Phase 4：βテスト + 改善 + 本番リリース（2週間）

- [ ] 4-1. パイロット企業（仮：山田建設）にテスト導入
- [ ] 4-2. フィードバック反映
- [ ] 4-3. 本番デプロイ（Vercel + Supabase Pro）
- [ ] 4-4. 監視（Sentry）導入

---

## 3. データベーススキーマ（Supabase / PostgreSQL）

### 3.1 SQL（このまま実行する）

```sql
-- =========================================
-- 拡張機能
-- =========================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =========================================
-- 会社・ユーザー
-- =========================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_code TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'standard',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('admin', 'supervisor', 'worker', 'viewer');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  auth_id UUID UNIQUE,  -- Supabase Auth との紐付け
  name TEXT NOT NULL,
  name_kana TEXT,
  email TEXT,
  phone TEXT,
  role user_role DEFAULT 'worker',
  job_tag TEXT,  -- 鉄筋工/左官/大工/設備/電気...
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_company ON users(company_id);

-- =========================================
-- 現場
-- =========================================
CREATE TYPE site_status AS ENUM ('planned', 'active', 'completed', 'archived');

CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  started_at DATE,
  ended_at DATE,
  status site_status DEFAULT 'active',
  supervisor_id UUID REFERENCES users(id),
  client_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sites_company ON sites(company_id);

CREATE TABLE site_members (
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'worker',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (site_id, user_id)
);

-- =========================================
-- 招待
-- =========================================
CREATE TABLE invitations (
  code TEXT PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  role user_role DEFAULT 'worker',
  expires_at TIMESTAMPTZ,
  used_by UUID REFERENCES users(id),
  used_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- 日報
-- =========================================
CREATE TYPE report_status AS ENUM ('draft', 'sent');

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  work_date DATE NOT NULL,
  raw_text TEXT,                  -- 音声入力の元テキスト
  parsed_json JSONB DEFAULT '{}', -- 構造化データ
  status report_status DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_site_date ON reports(site_id, work_date DESC);

-- =========================================
-- 写真
-- =========================================
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES users(id),
  storage_path TEXT NOT NULL,     -- Supabase Storageのpath
  thumbnail_path TEXT,
  taken_at TIMESTAMPTZ,
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  tags TEXT[] DEFAULT '{}',
  caption TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_site_date ON photos(site_id, taken_at DESC);
CREATE INDEX idx_photos_tags ON photos USING GIN(tags);

-- =========================================
-- トーク
-- =========================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  body TEXT,
  attachments JSONB DEFAULT '[]', -- [{type, url, name}]
  pinned BOOLEAN DEFAULT FALSE,
  pinned_at TIMESTAMPTZ,
  parent_message_id UUID REFERENCES messages(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_site_created ON messages(site_id, created_at DESC);

CREATE TABLE message_reads (
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (message_id, user_id)
);

-- =========================================
-- 進捗管理（D-01）
-- =========================================
CREATE TYPE task_status AS ENUM ('not_started', 'in_progress', 'paused', 'completed');

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  planned_date DATE,
  created_by UUID NOT NULL REFERENCES users(id),
  status task_status DEFAULT 'not_started',
  progress_pct INTEGER DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  paused_reason TEXT,         -- 雨天/資材待ち/人員不足/その他
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  acknowledged_by UUID REFERENCES users(id),  -- 内勤の確認済みフラグ
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_site_date ON tasks(site_id, planned_date DESC);
CREATE INDEX idx_tasks_status ON tasks(status);

CREATE TABLE task_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  status_from task_status,
  status_to task_status,
  progress_pct INTEGER,
  comment TEXT,
  photo_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_updates_task ON task_updates(task_id, created_at DESC);

-- =========================================
-- 人員アサイン（E-01, E-02）
-- =========================================
CREATE TYPE shift_type AS ENUM ('full', 'am', 'pm');
CREATE TYPE assignment_status AS ENUM ('planned', 'confirmed', 'changed', 'cancelled');

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  shift shift_type DEFAULT 'full',
  job_tag TEXT,
  status assignment_status DEFAULT 'planned',
  notes TEXT,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assignments_date ON assignments(company_id, work_date);
CREATE INDEX idx_assignments_user_date ON assignments(user_id, work_date);
CREATE INDEX idx_assignments_site_date ON assignments(site_id, work_date);

CREATE TABLE assignment_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL,  -- 'site_cancelled' / 'reassigned' / 'shift_changed'
  before_json JSONB,
  after_json JSONB,
  reason TEXT,                -- 雨天/体調不良/急ぎの応援
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assignment_acks (
  change_id UUID NOT NULL REFERENCES assignment_changes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  acknowledged_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (change_id, user_id)
);

-- =========================================
-- 通知
-- =========================================
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys_p256dh TEXT NOT NULL,
  keys_auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,         -- report_sent/mention/pin/photo/task_update/assignment_change
  title TEXT NOT NULL,
  body TEXT,
  link_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC) WHERE read_at IS NULL;

-- =========================================
-- ナレッジ検索（全文検索）
-- =========================================
CREATE TABLE search_index (
  entity_type TEXT NOT NULL,   -- 'report'/'message'/'photo'/'task'
  entity_id UUID NOT NULL,
  company_id UUID NOT NULL,
  site_id UUID,
  text_content TEXT NOT NULL,
  tsv TSVECTOR,
  author_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (entity_type, entity_id)
);

-- 日本語全文検索（pg_trgm + tsvector）
CREATE INDEX idx_search_tsv ON search_index USING GIN(tsv);
CREATE INDEX idx_search_trgm ON search_index USING GIN(text_content gin_trgm_ops);
CREATE INDEX idx_search_company_site ON search_index(company_id, site_id, created_at DESC);

-- =========================================
-- 監査ログ
-- =========================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_company_date ON audit_logs(company_id, created_at DESC);

-- =========================================
-- updated_at 自動更新トリガー
-- =========================================
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_reports BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();
CREATE TRIGGER set_updated_at_tasks BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();
```

### 3.2 RLS（Row Level Security）

> Supabaseはデフォルトで有効化必須。会社単位のデータ分離を絶対に守る。

```sql
-- すべてのテーブルでRLS有効化
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_changes ENABLE ROW LEVEL SECURITY;

-- 共通：自分の会社のデータのみアクセス可能
CREATE POLICY "users_company_isolation" ON users
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "sites_company_isolation" ON sites
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE auth_id = auth.uid()
    )
  );

-- 他テーブルも同パターンで設定（site_id経由でcompany_idを引く）
CREATE POLICY "reports_company_isolation" ON reports
  FOR ALL USING (
    site_id IN (
      SELECT id FROM sites WHERE company_id IN (
        SELECT company_id FROM users WHERE auth_id = auth.uid()
      )
    )
  );
-- 他のテーブル（photos, messages, tasks, assignments）も同様に作成
```

### 3.3 search_index 自動更新トリガー

```sql
CREATE OR REPLACE FUNCTION trg_index_report()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO search_index (entity_type, entity_id, company_id, site_id, text_content, tsv, author_id, created_at)
  SELECT 'report', NEW.id, s.company_id, NEW.site_id,
         COALESCE(NEW.raw_text, '') || ' ' || COALESCE(NEW.parsed_json::text, ''),
         to_tsvector('simple', COALESCE(NEW.raw_text, '')),
         NEW.author_id, NEW.created_at
  FROM sites s WHERE s.id = NEW.site_id
  ON CONFLICT (entity_type, entity_id) DO UPDATE
    SET text_content = EXCLUDED.text_content,
        tsv = EXCLUDED.tsv;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER index_report_after_insert AFTER INSERT OR UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION trg_index_report();

-- messages, tasks, photosも同様にトリガー作成
```

---

## 4. 実装ガイド（重要機能のみ）

### 4.1 日報パーサー（C-01）

**場所**：`src/lib/parser/report.ts`

```typescript
// 入力例：「今日は鉄筋3人、左官2人。午後から雨で作業中断。安全確認は完了してます」
// 出力：構造化されたJSON

export type ParsedReport = {
  personnel: { job: string; count: number }[];
  total: number;
  weather?: 'sunny' | 'cloudy' | 'rain' | 'snow';
  interrupted: boolean;
  interruption_reason?: string;
  safety_check: 'done' | 'partial' | 'not_done';
  notes?: string;
  unrecognized: string[];  // 未認識部分（手動補正用）
};

const JOB_PATTERNS = [
  { name: '鉄筋工', regex: /鉄筋(?:工|者)?\s*(\d+)/ },
  { name: '左官', regex: /左官(?:工|者)?\s*(\d+)/ },
  { name: '大工', regex: /大工\s*(\d+)/ },
  { name: '設備', regex: /設備(?:工)?\s*(\d+)/ },
  { name: '電気', regex: /電気(?:工)?\s*(\d+)/ },
  { name: '土工', regex: /土工\s*(\d+)/ },
  { name: 'とび職', regex: /(?:とび|鳶)(?:工|職)?\s*(\d+)/ },
  // ペルソナ企業（山田建設）の主要工種を中心に拡張可能
];

const WEATHER_PATTERNS = {
  sunny: /晴れ|快晴/,
  cloudy: /曇り|くもり/,
  rain: /雨|降雨|降ってきた/,
  snow: /雪|降雪/,
};

export function parseReport(text: string): ParsedReport {
  const result: ParsedReport = {
    personnel: [],
    total: 0,
    interrupted: false,
    safety_check: 'not_done',
    unrecognized: [],
  };

  // 人員マッチング
  for (const { name, regex } of JOB_PATTERNS) {
    const m = text.match(regex);
    if (m) {
      const count = parseInt(m[1], 10);
      result.personnel.push({ job: name, count });
      result.total += count;
    }
  }

  // 天候
  for (const [key, pattern] of Object.entries(WEATHER_PATTERNS)) {
    if (pattern.test(text)) {
      result.weather = key as ParsedReport['weather'];
      break;
    }
  }

  // 中断判定
  if (/中断|止めた|やめた/.test(text)) {
    result.interrupted = true;
    if (/雨/.test(text)) result.interruption_reason = '雨天';
    else if (/資材/.test(text)) result.interruption_reason = '資材待ち';
    else if (/事故|怪我/.test(text)) result.interruption_reason = '事故';
  }

  // 安全確認
  if (/安全確認.{0,10}(?:完了|済|オーケー|OK)/.test(text)) {
    result.safety_check = 'done';
  } else if (/安全確認.{0,10}(?:一部|部分)/.test(text)) {
    result.safety_check = 'partial';
  }

  return result;
}
```

### 4.2 音声入力コンポーネント

**場所**：`src/components/report/VoiceInput.tsx`

**注意点**：
- iOS Safari は `webkitSpeechRecognition` を使う
- マイク許可がない場合は分かりやすい言葉で誘導
- 録音中は明確に視覚フィードバック（赤い丸＋アニメ）

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceInput({ onResult }: { onResult: (text: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const r = new SR();
    r.lang = 'ja-JP';
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e: any) => {
      onResult(e.results[0][0].transcript);
      setRecording(false);
    };
    r.onerror = () => setRecording(false);
    r.onend = () => setRecording(false);
    recognitionRef.current = r;
  }, [onResult]);

  if (!supported) {
    return null; // テキスト入力にフォールバック
  }

  const toggle = () => {
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
    } else {
      recognitionRef.current?.start();
      setRecording(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`
        flex items-center justify-center
        w-20 h-20 rounded-full
        ${recording ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}
        text-white shadow-lg
        active:scale-95 transition
      `}
      aria-label={recording ? '録音を止める' : 'マイクで話す'}
    >
      {recording ? <MicOff size={36} /> : <Mic size={36} />}
    </button>
  );
}
```

### 4.3 進捗管理（D-01）

**現場側の画面要件**

- ファーストビュー：今日のタスクカードが縦に並ぶ
- 各カードは「タイトル + 大きな状態バッジ + 進捗％」の3要素のみ
- カードをタップ → 詳細画面でステータス変更
- ステータス変更ボタンは画面下部に大きく配置
  - `[着手]` `[中断]` `[完了]` の3つを巨大ボタンで横並び

**内勤側の画面要件**（PC前提）

- 全現場×ステータスの2次元マトリクス
- 行＝現場、列＝`未着手 / 着手中 / 中断中 / 完了`
- セルに該当タスクのカードを表示
- 中断中の現場は赤背景で強調
- カードクリック → 右ペインに詳細（写真・コメント履歴・「確認済み」ボタン）

### 4.4 人員アサインボード（E-01）★最重要

**コンセプト**：個別連絡で回していた人員配置を、**全員が同じ画面で見る**ことに変える。

**画面要件**

- **メインビュー（PC・タブレット）**：
  - 縦軸：日付（今日〜2週間先）
  - 横軸：現場
  - セル：その日その現場にいる人のアバター＋名前
  - セルをクリック → 人員追加・削除モーダル
  - 必要人数より少ない場合はセルが赤くなる

- **個人ビュー（スマホ）**：
  - カレンダー型で「自分の予定」が縦に並ぶ
  - 「明日：A邸新築（鉄筋）／午前」のような表示
  - 変更があった場合は赤いバッジで通知

- **共通**：
  - 画面右上に「だれでも見れる人員ボード」のラベル明示
  - 「鈴木さんが個別連絡している必要がない」を実現する
  - フィルター：日付範囲 / 現場 / 職種 / メンバー名

**急変更ボタン（E-02）**

- 管理者の画面に常時表示される赤い大きなボタン：
  ```
  [急に変更する]
  ```
- タップすると2択：
  - 「現場を中止する」 → 現場選択 → その日の全アサインキャンセル
  - 「人を入れ替える」 → ドラッグ&ドロップで別現場へ移動
- 変更後、対象者全員にプッシュ通知＋赤い通知カード
- 対象者は「了解しました」ボタンで管理者画面に既読を返す

### 4.5 文言の統一実装

**場所**：`src/lib/copy.ts`

```typescript
// 全画面の文言をここに集約。後で一括変更しやすくする。
export const COPY = {
  auth: {
    login_title: 'はじめる',
    login_button: 'はじめる',
    join_with_code: '招待コードで入る',
    company_code_label: '会社のコード',
    email_label: 'メールアドレス',
    password_label: 'パスワード',
    logout: 'おわる',
  },
  nav: {
    home: 'ホーム',
    sites: '現場',
    personnel: '人員',
    search: '探す',
    settings: '設定',
  },
  site: {
    create: '現場をつくる',
    archive: 'しまう',
    members: 'メンバー',
  },
  report: {
    create: '日報を書く',
    voice_hint: 'マイクをおして、話してね',
    text_hint: 'またはここに書いてね',
    generate: '日報をつくる',
    send: '事務所に送る',
    sent: '送りました！',
    save_draft: '下書きをのこす',
  },
  task: {
    today: '今日のしごと',
    add: 'しごとをふやす',
    status: {
      not_started: 'まだ',
      in_progress: 'やってる',
      paused: 'とまってる',
      completed: 'おわった',
    },
    pause_reasons: {
      rain: '雨',
      material: '材料まち',
      manpower: '人手たりない',
      other: 'そのほか',
    },
  },
  assignment: {
    board_title: '人員ボード',
    today: '今日',
    tomorrow: 'あした',
    unassigned: 'まだ決まってない',
    change_button: '急に変更する',
    cancel_site: '現場を中止する',
    swap_people: '人を入れ替える',
    acknowledge: '了解しました',
    notify_subject: '配置がかわりました',
  },
  notification: {
    title: 'おしらせ',
    no_notifications: 'おしらせはありません',
  },
  common: {
    save: '保存',
    cancel: 'やめる',
    delete: 'けす',
    confirm: 'これでOK',
    back: 'もどる',
    loading: '読みこみ中…',
    error_default: 'うまくいかなかった。もう一回ためしてね',
  },
};
```

---

## 5. UIコンポーネントの実装ルール

### 5.1 ボタンの絶対ルール

```tsx
// ❌ ダメな例
<button className="text-blue-500 underline">送信</button>

// ✅ OKな例
<button className="
  min-h-[60px] px-6 py-4
  text-lg font-bold
  bg-orange-500 text-white
  rounded-xl shadow-md
  active:scale-95 transition
  flex items-center justify-center gap-2
">
  <Send size={24} />
  事務所に送る
</button>
```

**ルール**：
- 主要ボタンの最小高さ：60px
- 副次ボタンの最小高さ：44px
- 色だけで意味を伝えない（必ずアイコン併記）
- 文字サイズは18px以上（職人さんは老眼）
- ホバー効果より「押した感」を優先（`active:scale-95`）

### 5.2 ステータスバッジ

```tsx
// 進捗・アサインのステータスは色＋テキスト＋アイコン
<Badge className="bg-green-500 text-white">
  <Check size={16} /> やってる
</Badge>
<Badge className="bg-red-500 text-white">
  <Pause size={16} /> とまってる
</Badge>
```

### 5.3 入力フォームのルール

- placeholder ではなく、上にラベルを置く（読み上げ・コピペ対策）
- 必須項目は文言で示す：「（必須）」と書く（赤い米印は使わない）
- 入力エラーは「具体的な原因」を入力欄の下に表示

### 5.4 アイコンライブラリ

- `lucide-react` を統一して使う
- サイズは20/24/32/40の4段階に統一

---

## 6. PWA設定

### 6.1 manifest.json

**場所**：`public/manifest.json`

```json
{
  "name": "GENBA NOTE",
  "short_name": "GENBA",
  "description": "現場ナレッジ管理ツール",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#F8F9FA",
  "theme_color": "#2C3E50",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 6.2 Service Worker

`next-pwa` ではなく、Next.js 14のApp Routerと相性の良い `@serwist/next` を推奨。

```bash
pnpm add @serwist/next
```

---

## 7. デプロイ

### 7.1 Supabase

```bash
supabase init
supabase link --project-ref xxx
supabase db push
```

### 7.2 Vercel

```bash
vercel
# 環境変数をVercel側に設定
```

---

## 8. Cursorへの指示テンプレ集

### 8.1 機能実装の依頼パターン

```
@機能仕様書.md の §3.D-01 進捗管理 を実装してください。
- 仮ペルソナは @cursor指示書.md の§0.2を参照
- 文言は @cursor指示書.md の§0.3、§4.5のCOPYを使う
- DBスキーマは @cursor指示書.md の§3を確認
- 実装後、Phase 2のチェックリスト§2のうち該当項目を完了マークしてください
```

### 8.2 UI実装の依頼パターン

```
日報作成画面 (S-04) を実装してください。
- 制約：§5.1のボタンルール、§5.2のステータスバッジ、§5.3の入力フォームルール
- 文言：§4.5のCOPY.report
- 仮ペルソナの田中さん（55歳・老眼）を基準に判断
```

### 8.3 文言修正の依頼パターン

```
§0.3のNGワードリストに従って、src/全体を grep して修正してください。
特に「アップロード」「ステータス」「キャンセル」を中心に確認。
```

---

## 9. 開発中の意思決定ルール

迷ったらこの順で判断する：

1. **田中さん（55歳職人）が直感で操作できるか？**
2. **2タップ以内で目的の操作が完結するか？**
3. **画面に必要以上の情報を出していないか？**
4. **エラー時、本人を責めずに具体的な解決策を示せているか？**
5. **ITに苦手意識のある人が「便利」と感じるか？**

これに反する実装は、技術的に正しくても作り直す。

---

## 10. 確認チェックリスト（リリース前）

### 機能
- [ ] 田中さん基準：日報送信が30秒以内
- [ ] 鈴木さん基準：人員配置が朝30分以内
- [ ] 急変更：5分以内に全員に伝わる
- [ ] ナレッジ検索：「雨天」「中断」で過去事例が見つかる

### UI/UX
- [ ] 全ボタンが60px以上（主要）/ 44px以上（副次）
- [ ] IT用語が画面に出ていない（§0.3 NGワード grep）
- [ ] エラーメッセージが具体的・非難的でない
- [ ] iPhone SEサイズ（375px）でレイアウト崩れなし

### 技術
- [ ] RLSが全テーブルで有効
- [ ] search_indexトリガーが動作している
- [ ] PWAインストール可能
- [ ] iOS実機でWeb Speech APIが動く

---

以上
