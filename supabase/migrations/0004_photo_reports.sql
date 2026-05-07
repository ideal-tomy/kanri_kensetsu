-- 0004_photo_reports.sql
-- 写真報告（PhotoReport 型）

create type photo_category as enum ('regular', 'progress');

create table if not exists photo_reports (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  user_name text not null,
  category photo_category not null,
  file_name text not null,
  title text,                -- progress では必須（アプリ側で validate）
  note text,
  storage_path text not null,
  created_at timestamptz default now()
);

create index if not exists idx_photo_reports_site on photo_reports(site_id, created_at desc);
create index if not exists idx_photo_reports_category on photo_reports(category);
create index if not exists idx_photo_reports_user on photo_reports(user_id, created_at desc);

alter table photo_reports enable row level security;

create policy "photo_reports_company_isolation" on photo_reports
  for all using (
    site_id in (
      select id from sites where company_id in (
        select company_id from users where auth_id = auth.uid()
      )
    )
  );
