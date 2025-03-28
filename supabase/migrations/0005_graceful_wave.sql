/*
  # Remove all security policies and RLS

  This migration:
  1. Drops all existing policies
  2. Disables RLS on all tables
  3. Allows unrestricted access
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow authenticated users to insert rides" ON rides;
DROP POLICY IF EXISTS "Allow users to read their own rides" ON rides;
DROP POLICY IF EXISTS "Allow authenticated users to insert user_rides" ON user_rides;
DROP POLICY IF EXISTS "Allow users to read their own user_rides" ON user_rides;

-- Disable RLS on all tables
ALTER TABLE rides DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_rides DISABLE ROW LEVEL SECURITY;