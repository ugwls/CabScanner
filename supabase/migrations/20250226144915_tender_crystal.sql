/*
  # Fix ride history RLS policies

  1. Changes
    - Update RLS policies to properly handle ride insertions
    - Ensure users can only view their own rides
    - Fix the issue with ride insertion failing

  2. Security
    - Maintain proper access control
    - Prevent unauthorized access to ride data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their linked rides" ON rides;
DROP POLICY IF EXISTS "Users can insert rides" ON rides;
DROP POLICY IF EXISTS "Users can view their own user_rides" ON user_rides;
DROP POLICY IF EXISTS "Users can insert their own user_rides" ON user_rides;

-- Create new policies for rides table
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

CREATE POLICY "Enable insert access for authenticated users"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for user_rides table
CREATE POLICY "Enable read access for users own rides"
  ON user_rides
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Enable insert access for users own rides"
  ON user_rides
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Ensure RLS is enabled
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rides ENABLE ROW LEVEL SECURITY;