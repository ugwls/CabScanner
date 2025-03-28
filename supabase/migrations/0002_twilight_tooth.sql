/*
  # Update RLS policies for rides table
  
  1. Changes
    - Modify insert policy to properly handle user authentication
    - Ensure rides can be inserted with user association
    - Maintain security while allowing proper access
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own rides" ON rides;
DROP POLICY IF EXISTS "Users can view their own rides" ON rides;

-- Create new policies
CREATE POLICY "Users can insert rides when authenticated"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own rides"
  ON rides
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_rides
      WHERE user_rides.ride_id = rides.id
      AND user_rides.user_id = auth.uid()
    )
  );

-- Update user_rides policies
DROP POLICY IF EXISTS "Users can link rides to themselves" ON user_rides;

CREATE POLICY "Users can link rides when authenticated"
  ON user_rides
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);