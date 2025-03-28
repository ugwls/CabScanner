/*
  # Fix ride history RLS policies

  1. Changes
    - Simplify RLS policies for rides and user_rides tables
    - Ensure proper access control for ride history
    - Fix the issue with ride insertion failing

  2. Security
    - Maintain proper data isolation between users
    - Prevent unauthorized access to ride data
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Enable read access for users based on user_rides" ON rides;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON rides;
DROP POLICY IF EXISTS "Enable read access for users own rides" ON user_rides;
DROP POLICY IF EXISTS "Enable insert access for users own rides" ON user_rides;

-- Create simplified policies for rides table
CREATE POLICY "Allow authenticated users to insert rides"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow users to read their linked rides"
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

-- Create simplified policies for user_rides table
CREATE POLICY "Allow users to manage their own ride links"
  ON user_rides
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Ensure RLS is enabled
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rides ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_rides_user_id_ride_id ON user_rides(user_id, ride_id);