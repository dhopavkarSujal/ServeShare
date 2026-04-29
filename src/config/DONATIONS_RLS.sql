-- DONATIONS TABLE RLS POLICIES
-- Run these in Supabase SQL Editor to enable Row Level Security

-- Enable RLS on donations table
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can SELECT only their own donations
CREATE POLICY "users can read own donations"
  ON donations
  FOR SELECT
  USING (auth.uid() = donor_id);

-- Policy 2: Users can INSERT their own donations
CREATE POLICY "users can insert own donations"
  ON donations
  FOR INSERT
  WITH CHECK (auth.uid() = donor_id);

-- Policy 3: Users can UPDATE only their own donations (for status changes)
CREATE POLICY "users can update own donations"
  ON donations
  FOR UPDATE
  USING (auth.uid() = donor_id);

-- Policy 4: Admin can SELECT all donations (if you have admin column)
-- Uncomment if admin role management exists
-- CREATE POLICY "admin can read all donations"
--   ON donations
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM profiles
--       WHERE profiles.id = auth.uid()
--       AND profiles.role = 'admin'
--     )
--   );

-- Debug Query: Check current user ID
-- SELECT auth.uid();

-- Debug Query: Check your profiles
-- SELECT id, email, full_name, role FROM profiles WHERE id = auth.uid();

-- Debug Query: Check your donations
-- SELECT id, donor_id, item_name, status, created_at FROM donations WHERE donor_id = auth.uid();
