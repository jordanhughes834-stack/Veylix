-- Veylix cloud sync schema.
--
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New
-- query) after creating the project. Not auto-applied by any build step.
--
-- The whole app `state` blob (exercises, split, sessions, draft) is stored
-- as one JSONB document per user - the app already treats state as one
-- atomic object everywhere, so there's no need for per-set tables.

create table public.veylix_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.veylix_state enable row level security;

create policy "select own state" on public.veylix_state
  for select using (auth.uid() = user_id);

create policy "insert own state" on public.veylix_state
  for insert with check (auth.uid() = user_id);

create policy "update own state" on public.veylix_state
  for update using (auth.uid() = user_id);

-- After running this:
-- 1. Authentication -> Providers -> Email -> turn OFF "Allow new users to
--    sign up". The app has no signup form, but the REST signup endpoint is
--    reachable by anyone who reads the (intentionally public) anon key out
--    of the page source - RLS means they could never touch your row, but
--    there's no reason to leave the endpoint open.
-- 2. Authentication -> Users -> Add user. Set your email + password, and
--    tick "Auto Confirm User" - without that, signing in fails with no
--    recovery path, since there's deliberately no in-app confirmation or
--    password-reset flow.
-- 3. Settings -> API -> copy the Project URL and the anon public key into
--    SUPABASE_URL / SUPABASE_ANON_KEY in src/app.js, then run
--    `python3 build.py` to rebuild index.html.
