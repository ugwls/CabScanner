/*
  # Add update policy for saved places

  1. Changes
    - Add policy to allow users to update their own places
*/

-- Create policy for updating saved places
CREATE POLICY "Users can update their own places"
  ON saved_places
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);