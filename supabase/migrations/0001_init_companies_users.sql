-- 0001_init_companies_users.sql
-- 会社・ユーザー基盤
-- 注意: auth.users は Supabase Auth が管理する。app 側の users はその拡張プロフィール。

create extension if not exists "pgcrypto";

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  created_at timestamptz default now()
);

create type app_role as enum ('worker', 'supervisor', 'admin', 'owner');

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid references auth.users(id) on delete set null,
  company_id uuid references companies(id) on delete cascade,
  name text not null,
  role app_role not null,
  phone text,
  email text,
  created_at timestamptz default now()
);

create index if not exists idx_users_company on users(company_id);
create index if not exists idx_users_auth on users(auth_id);

alter table users enable row level security;
alter table companies enable row level security;

-- 同じ会社のユーザーだけ閲覧可
create policy "users_company_isolation" on users
  for all using (
    company_id in (
      select company_id from users where auth_id = auth.uid()
    )
  );

create policy "companies_self" on companies
  for select using (
    id in (
      select company_id from users where auth_id = auth.uid()
    )
  );
