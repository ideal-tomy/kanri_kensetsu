-- v1.1 シードデータ：仮ペルソナ「東都建設株式会社」
-- 開発環境用。`supabase db reset` で再現可能にする。

-- 会社
INSERT INTO companies (id, name, company_code) VALUES
  ('00000000-0000-0000-0000-000000000001', '東都建設株式会社', 'YAMADA')
ON CONFLICT (company_code) DO NOTHING;

-- ユーザー（職人5名・監督2名・内勤1名・社長1名）
INSERT INTO users (company_id, name, role, job_tag) VALUES
  ('00000000-0000-0000-0000-000000000001', '田中太郎', 'worker',     '鉄筋工'),
  ('00000000-0000-0000-0000-000000000001', '佐藤次郎', 'worker',     '左官'),
  ('00000000-0000-0000-0000-000000000001', '鈴木三郎', 'worker',     '大工'),
  ('00000000-0000-0000-0000-000000000001', '高橋四郎', 'worker',     '設備'),
  ('00000000-0000-0000-0000-000000000001', '渡辺五郎', 'worker',     '電気'),
  ('00000000-0000-0000-0000-000000000001', '伊藤監督', 'supervisor', '監督'),
  ('00000000-0000-0000-0000-000000000001', '山本監督', 'supervisor', '監督'),
  ('00000000-0000-0000-0000-000000000001', '中村花子', 'admin',      '内勤'),
  ('00000000-0000-0000-0000-000000000001', '山田社長', 'owner',      '経営')
ON CONFLICT DO NOTHING;

-- 現場（3つ）
INSERT INTO sites (company_id, name, address, started_at, status, overall_progress) VALUES
  ('00000000-0000-0000-0000-000000000001', '新宿駅西口再開発A棟',   '東京都新宿区西新宿1-1-1', '2026-04-01', 'active', 42),
  ('00000000-0000-0000-0000-000000000001', '大手町オフィスタワー改修', '東京都千代田区大手町1-5-1', '2026-03-15', 'active', 68),
  ('00000000-0000-0000-0000-000000000001', '豊洲オフィスレジデンス', '東京都江東区豊洲3-2-24', '2026-04-20', 'active', 15)
ON CONFLICT DO NOTHING;

-- タスク（新宿駅西口再開発A棟に3つ、出来高つき）
INSERT INTO tasks (site_id, title, unit, planned_qty, actual_qty, status, progress_pct, created_by) VALUES
  ((SELECT id FROM sites WHERE name='新宿駅西口再開発A棟'),
    '外壁ボード貼り', '枚', 35, 18, 'in_progress', 51,
    (SELECT id FROM users WHERE name='田中太郎')),
  ((SELECT id FROM sites WHERE name='新宿駅西口再開発A棟'),
    '基礎配筋',       '本', 120, 120, 'completed', 100,
    (SELECT id FROM users WHERE name='田中太郎')),
  ((SELECT id FROM sites WHERE name='新宿駅西口再開発A棟'),
    '床コンクリート', 'm²', 80, 0, 'not_started', 0,
    (SELECT id FROM users WHERE name='伊藤監督'))
ON CONFLICT DO NOTHING;

-- 人員配置（今週・CURRENT_DATE基準で月曜起点に展開）
-- 田中：新宿駅西口再開発A棟 月火木金 日勤
-- 佐藤：新宿駅西口再開発A棟 月火木   日勤
-- 鈴木：大手町オフィスタワー改修 月火水金土 夜勤
-- 山田：豊洲オフィスレジデンス 火水木金 日勤
WITH this_monday AS (
  SELECT (CURRENT_DATE - ((EXTRACT(ISODOW FROM CURRENT_DATE)::int - 1)) * INTERVAL '1 day')::date AS d
)
INSERT INTO assignments (company_id, user_id, site_id, work_date, shift, status, assigned_by)
SELECT
  '00000000-0000-0000-0000-000000000001',
  u.id, s.id,
  (m.d + (offset_days || ' days')::interval)::date,
  shift_value::shift_type,
  'planned',
  (SELECT id FROM users WHERE name='中村花子')
FROM this_monday m, (
  VALUES
    ('田中太郎', '新宿駅西口再開発A棟',   'day_full',   0),
    ('田中太郎', '新宿駅西口再開発A棟',   'day_full',   1),
    ('田中太郎', '新宿駅西口再開発A棟',   'day_full',   3),
    ('田中太郎', '新宿駅西口再開発A棟',   'day_full',   4),
    ('佐藤次郎', '新宿駅西口再開発A棟',   'day_full',   0),
    ('佐藤次郎', '新宿駅西口再開発A棟',   'day_full',   1),
    ('佐藤次郎', '新宿駅西口再開発A棟',   'day_full',   3),
    ('鈴木三郎', '大手町オフィスタワー改修', 'night_full', 0),
    ('鈴木三郎', '大手町オフィスタワー改修', 'night_full', 1),
    ('鈴木三郎', '大手町オフィスタワー改修', 'night_full', 2),
    ('鈴木三郎', '大手町オフィスタワー改修', 'night_full', 4),
    ('鈴木三郎', '大手町オフィスタワー改修', 'night_full', 5),
    ('山田社長', '豊洲オフィスレジデンス', 'day_full',   1),
    ('山田社長', '豊洲オフィスレジデンス', 'day_full',   2),
    ('山田社長', '豊洲オフィスレジデンス', 'day_full',   3),
    ('山田社長', '豊洲オフィスレジデンス', 'day_full',   4)
) AS seed(user_name, site_name, shift_value, offset_days)
JOIN users u ON u.name = seed.user_name
JOIN sites s ON s.name = seed.site_name
ON CONFLICT DO NOTHING;
