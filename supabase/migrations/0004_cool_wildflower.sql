/*
  # Fix RLS policies for rides and user_rides tables

  1. Changes
    - Update RLS policies to properly handle ride insertions
    - Fix user_rides policies to allow proper associations
    - Add missing policies for authenticated users

  2. Security
    - Ensure authenticated users can insert rides
    - Allow users to view only their own rides
    - Enable proper user-ride associations
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON rides;
DROP POLICY IF EXISTS "Enable read access for users based on user_rides" ON rides;
DROP POLICY IF EXISTS "Enable insert for authenticated users on user_rides" ON user_rides;
DROP POLICY IF EXISTS "Enable read for users own rides" ON user_rides;

-- Create new policies for rides table
CREATE POLICY "Allow authenticated users to insert rides"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow users to read their own rides"
  ON rides
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_rides
      WHERE user_rides.ride_id = id
      AND user_rides.user_id = auth.uid()
    )
  );

-- Create new policies for user_rides table
CREATE POLICY "Allow authenticated users to insert user_rides"
  ON user_rides
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users to read their own user_rides"
  ON user_rides
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Ensure tables have RLS enabled
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rides ENABLE ROW LEVEL SECURITY;