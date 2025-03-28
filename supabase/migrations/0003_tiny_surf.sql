/*
  # Fix RLS policies for rides system
  
  1. Changes
    - Reset and recreate all policies with proper checks
    - Ensure proper order of operations for ride saving
    - Add missing policies for user_rides table
  
  2. Security
    - Maintain RLS protection
    - Allow proper authenticated access
    - Prevent unauthorized access
*/

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert rides when authenticated" ON rides;
DROP POLICY IF EXISTS "Users can view their own rides" ON rides;
DROP POLICY IF EXISTS "Users can link rides when authenticated" ON user_rides;

-- Recreate policies for rides table
CREATE POLICY "Enable insert for authenticated users"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for users based on user_rides"
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

-- Recreate policies for user_rides table
CREATE POLICY "Enable insert for authenticated users on user_rides"
  ON user_rides
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable read for users own rides"
  ON user_rides
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());