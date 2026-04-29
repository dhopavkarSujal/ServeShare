-- NOTIFICATIONS TABLE RLS POLICIES
-- Run these in Supabase SQL Editor to enable Row Level Security

-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can SELECT only their own notifications
CREATE POLICY "user can read own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can INSERT their own notifications
CREATE POLICY "user can insert own notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Admin can INSERT notifications for any user
CREATE POLICY "admin can insert notifications for any user"
  ON notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy 4: Admin can UPDATE notifications
CREATE POLICY "admin can update notifications"
  ON notifications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy 5: Admin can SELECT all notifications
CREATE POLICY "admin can read all notifications"
  ON notifications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Debug Queries:
-- Check current user
-- SELECT auth.uid();

-- Check your profile exists
-- SELECT id, email, full_name, role FROM profiles WHERE id = auth.uid();

-- Check your notifications
-- SELECT id, user_id, title, message, type, is_read, created_at FROM notifications WHERE user_id = auth.uid();

-- Check if admin
-- SELECT role FROM profiles WHERE id = auth.uid();
