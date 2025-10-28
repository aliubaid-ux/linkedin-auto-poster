-- This script first adds the necessary 'user_id' column to your tables
-- and then enables Row-Level Security (RLS) with the correct policies.

-- Add 'user_id' columns if they don't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.drafts ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.learned_tones ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.logs ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Drop existing policies if they exist, to ensure a clean slate
DROP POLICY IF EXISTS "Profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON profiles;

DROP POLICY IF EXISTS "Users can view their own drafts." ON drafts;
DROP POLICY IF EXISTS "Users can create drafts." ON drafts;
DROP POLICY IF EXISTS "Users can update their own drafts." ON drafts;
DROP POLICY IF EXISTS "Users can delete their own drafts." ON drafts;

DROP POLICY IF EXISTS "Users can view their own learned tones." ON learned_tones;
DROP POLICY IF EXISTS "Users can create learned tones." ON learned_tones;
DROP POLICY IF EXISTS "Users can update their own learned tones." ON learned_tones;

DROP POLICY IF EXISTS "Users can view their own logs." ON logs;
DROP POLICY IF EXISTS "Users can create logs." ON logs;

/**
* PROFILES
*/
alter table profiles enable row level security;

create policy "Profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = user_id);

/**
* DRAFTS
*/
alter table drafts enable row level security;

create policy "Users can view their own drafts." on drafts
  for select using (auth.uid() = user_id);

create policy "Users can create drafts." on drafts
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own drafts." on drafts
  for update using (auth.uid() = user_id);

create policy "Users can delete their own drafts." on drafts
  for delete using (auth.uid() = user_id);

/**
* LEARNED TONES
*/
alter table learned_tones enable row level security;

create policy "Users can view their own learned tones." on learned_tones
  for select using (auth.uid() = user_id);

create policy "Users can create learned tones." on learned_tones
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own learned tones." on learned_tones
  for update using (auth.uid() = user_id);

/**
* LOGS
*/
alter table logs enable row level security;

create policy "Users can view their own logs." on logs
  for select using (auth.uid() = user_id);

create policy "Users can create logs." on logs
  for insert with check (auth.uid() = user_id);
