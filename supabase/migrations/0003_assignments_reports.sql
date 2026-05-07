-- 0003_assignments_reports.sql
-- 配員 / 日報 / 通知

create type shift_type as enum (
  'day_full', 'day_am', 'day_pm',
  'night_full', 'night_early', 'night_late'
);

create type assignment_status as enum ('planned', 'confirmed', 'changed', 'cancelled');

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  user_name text not null,
  site_id uuid not null references sites(id) on delete cascade,
  site_name text not null,
  work_date date not null,
  shift shift_type not null,
  status assignment_status not null default 'planned',
  created_at timestamptz default now()
);

create index if not exists idx_assignments_workdate on assignments(work_date, site_id);
create index if not exists idx_assignments_user on assignments(user_id, work_date);

create table if not exists assignment_changes (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  reason text not null,
  before_site_name text not null,
  after_site_name text not null,
  acknowledged_by jsonb not null default '[]'::jsonb,
  changed_at timestamptz default now()
);

create index if not exists idx_assignment_changes_assignment on assignment_changes(assignment_id, changed_at desc);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  author_id uuid references users(id) on delete set null,
  author_name text not null,
  raw_text text not null,
  parsed jsonb,
  status text not null default 'sent',
  created_at timestamptz default now()
);

create index if not exists idx_reports_site on reports(site_id, created_at desc);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  target_user_id uuid references users(id) on delete cascade,
  target_site_ids jsonb not null default '[]'::jsonb,
  user_name text,
  title text not null,
  body text not null,
  severity text not null default 'info',
  read_by jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_notifications_company on notifications(company_id, created_at desc);
create index if not exists idx_notifications_target_user on notifications(target_user_id, created_at desc);

alter table assignments enable row level security;
alter table assignment_changes enable row level security;
alter table reports enable row level security;
alter table notifications enable row level security;

create policy "assignments_company_isolation" on assignments
  for all using (
    site_id in (
      select id from sites where company_id in (
        select company_id from users where auth_id = auth.uid()
      )
    )
  );

create policy "assignment_changes_company_isolation" on assignment_changes
  for all using (
    assignment_id in (
      select id from assignments where site_id in (
        select id from sites where company_id in (
          select company_id from users where auth_id = auth.uid()
        )
      )
    )
  );

create policy "reports_company_isolation" on reports
  for all using (
    site_id in (
      select id from sites where company_id in (
        select company_id from users where auth_id = auth.uid()
      )
    )
  );

create policy "notifications_company_isolation" on notifications
  for all using (
    company_id in (
      select company_id from users where auth_id = auth.uid()
    )
  );
