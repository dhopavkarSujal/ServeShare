-- DEBUG CHECKLIST FOR NOTIFICATIONS RLS
-- Run each query one by one in Supabase SQL Editor to verify setup

-- ============================================
-- 1. CHECK YOUR AUTH USER ID
-- ============================================
SELECT auth.uid() as current_auth_user_id;

-- Expected: Should show a UUID like "abc-123-xyz"
-- If shows: NULL → You're not logged in


-- ============================================
-- 2. CHECK IF PROFILE EXISTS FOR YOUR USER
-- ============================================
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  status,
  created_at
FROM profiles 
WHERE id = auth.uid();

-- Expected: Should show 1 row with your profile
-- If empty: ❌ PROBLEM - Profile doesn't exist!
-- SOLUTION: Run the INSERT at bottom of this file


-- ============================================
-- 3. CHECK RLS POLICIES ON NOTIFICATIONS TABLE
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'notifications';

-- Expected: Should show 4 policies:
-- - read own notifications
-- - insert own notifications
-- - admin can insert/read/update


-- ============================================
-- 4. TEST INSERT WITH DEBUG POLICY
-- ============================================
-- First, enable this debug policy:
CREATE POLICY "debug_allow_insert"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Then try:
INSERT INTO notifications (user_id, title, message, type, is_read)
VALUES (auth.uid(), 'Debug Test', 'Testing notification creation', 'info', false);

-- If this works → Problem is your RLS condition
-- If this fails → Problem is your data (wrong user_id / null)


-- ============================================
-- 5. CHECK YOUR NOTIFICATION DATA
-- ============================================
SELECT 
  id,
  user_id,
  title,
  message,
  type,
  is_read,
  created_at
FROM notifications
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;

-- Expected: Should show notifications you created
-- If empty: No notifications for current user


-- ============================================
-- 6. VERIFY RLS IS BLOCKING OTHER USERS' DATA
-- ============================================
SELECT 
  count(*) as total_notifications_in_system
FROM notifications;

-- Then compare to:
SELECT 
  count(*) as your_notifications
FROM notifications
WHERE user_id = auth.uid();

-- Expected: total > your_notifications
-- This means RLS is working (hiding others' data)


-- ============================================
-- 7. CHECK DONATIONS TABLE RLS
-- ============================================
SELECT 
  id,
  donor_id,
  item_name,
  category,
  status,
  created_at
FROM donations
WHERE donor_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;

-- Expected: Should see your donations only


-- ============================================
-- 8. FIX: CREATE MISSING PROFILE (if needed)
-- ============================================
-- Run this ONLY if query #2 returned empty

INSERT INTO profiles (id, full_name, email, role, status)
VALUES (auth.uid(), 'Your Name', auth.jwt() ->> 'email', 'donor', 'active')
ON CONFLICT (id) DO NOTHING;

-- Then verify with query #2 again


-- ============================================
-- 9. VERIFY RLS IS ENABLED
-- ============================================
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('notifications', 'donations', 'profiles')
ORDER BY tablename;

-- Expected: rowsecurity = true for all


-- ============================================
-- 10. CLEANUP: Remove debug policy when done
-- ============================================
-- After testing, remove the debug policy:
DROP POLICY IF EXISTS "debug_allow_insert" ON notifications;

-- ============================================
-- SUMMARY OF EXPECTED RESULTS
-- ============================================
/*
✅ auth.uid() returns a UUID
✅ profiles has 1 row for your user
✅ notifications has 3-4 policies
✅ debug insert works (means RLS condition is issue)
✅ SELECT shows your notifications
✅ rowsecurity = true on all tables
✅ Can't see other users' data

If ANY of these fail → See message in each section
*/
