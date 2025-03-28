/*
  # Disable RLS for rides and user_rides tables

  This migration disables Row Level Security (RLS) for the rides and user_rides tables
  to allow unrestricted access to ride history data.

  1. Changes:
    - Disable RLS on rides table
    - Disable RLS on user_rides table
    - Drop all existing policies

  WARNING: This removes security restrictions. Only use in development/testing.
*/

-- Drop all existing policies first
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON rides;
DROP POLICY IF EXISTS "Enable all operations for users own ride links" ON user_rides;

-- Disable RLS on both tables
ALTER TABLE rides DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_rides DISABLE ROW LEVEL SECURITY;