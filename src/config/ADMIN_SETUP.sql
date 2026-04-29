-- ========================================
-- ADMIN USER MANAGEMENT SETUP
-- Run these queries in Supabase SQL Editor
-- ========================================

-- 1. CREATE ADMIN AUDIT LOGS TABLE (Optional but recommended)
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles(id) on delete set null,
  target_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  details text,
  created_at timestamp with time zone default now()
);

-- 2. ENABLE RLS ON admin_audit_logs
alter table public.admin_audit_logs enable row level security;

-- 3. RLS POLICIES FOR admin_audit_logs
-- Admins can read all audit logs
create policy "admin can read audit logs"
on public.admin_audit_logs
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);

-- System (or functions) can insert audit logs
create policy "system can insert audit logs"
on public.admin_audit_logs
for insert
with check (true);

-- 4. UPDATE RLS POLICIES FOR profiles TABLE
-- Drop existing policies if they exist
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Admin can read all profiles
create policy "admin can read all profiles"
on public.profiles
for select
using (
  (auth.uid() = id)
  or
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);

-- Users can read own profile
create policy "users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

-- Admin can update all profiles
create policy "admin can update all profiles"
on public.profiles
for update
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);

-- Admin can insert profiles (for invite-admin edge function)
create policy "admin can insert profiles"
on public.profiles
for insert
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);

-- Users can update own profile (but not role or status)
create policy "users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = (select role from public.profiles where id = auth.uid())
  and status = (select status from public.profiles where id = auth.uid())
);

-- ========================================
-- NOTES:
-- - Profiles table needs both 'role' and 'status' columns
-- - Make sure your profiles table has 'updated_at' column (if not, add: ALTER TABLE profiles ADD COLUMN updated_at timestamp)
-- - After running these policies, test with an admin account
-- ========================================
