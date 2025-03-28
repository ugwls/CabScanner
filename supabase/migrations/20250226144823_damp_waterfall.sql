/*
  # Update ride history schema

  1. Changes
    - Add RLS policies for rides and user_rides tables
    - Ensure rides are properly linked to users
    - Fix ride history queries to only show user's own rides

  2. Security
    - Enable RLS on both tables
    - Add policies to restrict access to user's own rides
*/

-- Enable RLS on both tables
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rides ENABLE ROW LEVEL SECURITY;

-- Create policies for rides table
CREATE POLICY "Users can view their linked rides"
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

CREATE POLICY "Users can insert rides"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for user_rides table
CREATE POLICY "Users can view their own user_rides"
  ON user_rides
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own user_rides"
  ON user_rides
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_rides_user_id ON user_rides(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rides_ride_id ON user_rides(ride_id);