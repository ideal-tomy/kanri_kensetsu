-- 0005_id_mapping.sql
-- mock/projects.id（"p1" 等）と prototype-store.sites.id（"site-1" 等）を
-- Supabase の uuid に集約するためのマッピング。Phase 2 のID統一作業で使用。

create table if not exists migration_id_map (
  legacy_id text primary key,
  new_id uuid not null,
  source text not null,  -- 'mock_project' / 'prototype_site' / 'mock_worker' / etc.
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_migration_id_map_source on migration_id_map(source);
create index if not exists idx_migration_id_map_new_id on migration_id_map(new_id);
