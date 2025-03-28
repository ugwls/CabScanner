/*
  # Secure ride history access

  1. Security Changes
    - Enable RLS on rides and user_rides tables
    - Add policies to ensure users can only see their own rides
    - Add policies for inserting new rides and user_rides
    - Add indexes for better query performance

  2. Changes
    - Drop existing policies
    - Create new, more secure policies
    - Add performance optimizations
*/

-- First, enable RLS on both tables
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rides ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON rides;
DROP POLICY IF EXISTS "Enable all operations for users own ride links" ON user_rides;

-- Create policies for rides table
CREATE POLICY "Allow users to insert rides"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow users to view their own rides"
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

-- Create policies for user_rides table
CREATE POLICY "Allow users to insert their own ride links"
  ON user_rides
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users to view their own ride links"
  ON user_rides
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_rides_user_id ON user_rides(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rides_ride_id ON user_rides(ride_id);