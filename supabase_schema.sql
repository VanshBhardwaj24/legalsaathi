-- ============================================================
-- LegalSaathi — Block B "Sovereign Vault" Schema
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tugnytfntofswkazswjz/sql
-- ============================================================

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  is_pro boolean not null default false,
  income_bracket text, -- 'below_1l', '1l_3l', 'above_3l'
  eligibility_category text, -- 'SC', 'ST', 'Woman', 'Child', 'General', etc.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can only read/write their OWN profile
create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);


-- 2. Cases table — primary legal analysis storage
create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  -- null user_id = anonymous/incognito mode
  title text,
  query text not null,
  language text not null default 'English',
  result jsonb,
  share_token text unique default gen_random_uuid()::text,
  is_anonymous boolean not null default false,
  document_type text not null default 'generic', -- 'bail', 'pil', 'divorce', etc.
  expires_at timestamptz, -- set for anonymous cases; auto-cleaned by cron
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cases enable row level security;

-- Authenticated users can CRUD their own cases
create policy "cases: select own" on public.cases
  for select using (auth.uid() = user_id);

create policy "cases: insert own" on public.cases
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "cases: update own" on public.cases
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "cases: delete own" on public.cases
  for delete using (auth.uid() = user_id);

-- PUBLIC share link: anyone can SELECT by share_token (read-only share)
create policy "cases: share link read" on public.cases
  for select using (share_token is not null);


-- 3. Case Versions table — draft revision history
create table if not exists public.case_versions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  draft_text text not null,
  version_label text not null default 'Draft',
  created_at timestamptz not null default now()
);

alter table public.case_versions enable row level security;

-- Access versions only if user owns the parent case
create policy "case_versions: access through case" on public.case_versions
  for all using (
    exists (
      select 1 from public.cases c
      where c.id = case_id
        and c.user_id = auth.uid()
    )
  );


-- 4. Evidence Logs table — structured evidence tracking
create table if not exists public.evidence_logs (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  category text not null,
  document text not null,
  importance text not null, -- 'High', 'Medium', 'Low'
  reason text,
  action_step text,
  status text not null default 'Pending', -- 'Pending', 'Collected', 'Missing'
  created_at timestamptz not null default now()
);

alter table public.evidence_logs enable row level security;

create policy "evidence_logs: access through case" on public.evidence_logs
  for all using (
    exists (
      select 1 from public.cases c
      where c.id = case_id
        and c.user_id = auth.uid()
    )
  );


-- 5. Agent Activity table — transparent activity stream
create table if not exists public.agent_activity (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  agent_name text not null,
  action_type text not null, -- 'research', 'drafting', 'analysis'
  description text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.agent_activity enable row level security;

create policy "agent_activity: access through case" on public.agent_activity
  for all using (
    exists (
      select 1 from public.cases c
      where c.id = case_id
        and (c.user_id = auth.uid() or c.share_token is not null)
    )
  );


-- 6. Auto-create profile on new user signup (trigger)
create or replace function public.handle_new_user()
returns trigger
security definer set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Only create trigger if not already exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 5. Auto-cleanup anonymous cases with pg_cron (if extension is enabled)
-- Schedule: runs every day at midnight UTC
-- Uncomment after verifying pg_cron is enabled in Supabase Extensions
--
-- select cron.schedule(
--   'cleanup-anon-cases',
--   '0 0 * * *',
--   $$ delete from public.cases where is_anonymous = true and expires_at < now(); $$
-- );


-- 6. Updated_at auto-trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_cases_updated_at
  before update on public.cases
  for each row execute procedure public.set_updated_at();

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- GRANT permissions for anon + authenticated roles
-- ============================================================
grant usage on schema public to anon, authenticated;
grant select on public.cases to anon; -- for share link reads only
grant all on public.cases to authenticated;
grant all on public.profiles to authenticated;
grant all on public.case_versions to authenticated;
grant all on public.evidence_logs to authenticated;
grant all on public.agent_activity to authenticated;
grant select on public.agent_activity to anon; -- for shared views
