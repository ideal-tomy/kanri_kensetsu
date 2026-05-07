-- 0002_sites_tasks.sql
-- 現場 (sites) と タスク (tasks)

create type site_status as enum ('active', 'completed');

create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  status site_status not null default 'active',
  started_at date,
  ended_at date,
  overall_progress smallint not null default 0,
  supervisor_id uuid references users(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_sites_company on sites(company_id);
create index if not exists idx_sites_supervisor on sites(supervisor_id);

create type task_status as enum ('not_started', 'in_progress', 'paused', 'completed');
create type pause_reason as enum ('rain', 'material', 'manpower', 'other');

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  title text not null,
  status task_status not null default 'not_started',
  progress_pct smallint not null default 0,
  unit text,
  planned_qty numeric,
  actual_qty numeric not null default 0,
  today_target_qty numeric,
  paused_reason pause_reason,
  updated_at timestamptz default now()
);

create index if not exists idx_tasks_site on tasks(site_id, status);

create table if not exists task_updates (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  user_name text not null,
  qty_delta numeric,
  qty_after numeric,
  status_from task_status,
  status_to task_status,
  comment text,
  created_at timestamptz default now()
);

create index if not exists idx_task_updates_task on task_updates(task_id, created_at desc);

create table if not exists site_progress_logs (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  user_name text not null,
  progress_from smallint not null,
  progress_to smallint not null,
  comment text,
  created_at timestamptz default now()
);

create index if not exists idx_site_progress_site on site_progress_logs(site_id, created_at desc);

alter table sites enable row level security;
alter table tasks enable row level security;
alter table task_updates enable row level security;
alter table site_progress_logs enable row level security;

create policy "sites_company_isolation" on sites
  for all using (
    company_id in (
      select company_id from users where auth_id = auth.uid()
    )
  );

create policy "tasks_company_isolation" on tasks
  for all using (
    site_id in (
      select id from sites where company_id in (
        select company_id from users where auth_id = auth.uid()
      )
    )
  );

create policy "task_updates_company_isolation" on task_updates
  for all using (
    task_id in (
      select id from tasks where site_id in (
        select id from sites where company_id in (
          select company_id from users where auth_id = auth.uid()
        )
      )
    )
  );

create policy "site_progress_logs_company_isolation" on site_progress_logs
  for all using (
    site_id in (
      select id from sites where company_id in (
        select company_id from users where auth_id = auth.uid()
      )
    )
  );
