/*
  # Fix ride history RLS policies - Final Version

  1. Changes
    - Disable and recreate RLS policies for rides and user_rides tables
    - Implement proper access control for ride history
    - Fix the issue with ride insertion and viewing

  2. Security
    - Maintain proper data isolation between users
    - Ensure users can only view their own rides
    - Allow authenticated users to create new rides
*/

-- First disable RLS to start fresh
ALTER TABLE rides DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_rides DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rides ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to insert rides" ON rides;
DROP POLICY IF EXISTS "Allow users to read their linked rides" ON rides;
DROP POLICY IF EXISTS "Allow users to manage their own ride links" ON user_rides;

-- Create new policies for rides table
CREATE POLICY "Enable insert for authenticated users"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read for users own rides"
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
CREATE POLICY "Enable all operations for users own ride links"
  ON user_rides
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better query performance
DROP INDEX IF EXISTS idx_user_rides_user_id_ride_id;
CREATE INDEX idx_user_rides_user_id_ride_id ON user_rides(user_id, ride_id);