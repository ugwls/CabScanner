/*
  # Add delete policy for saved places

  1. Changes
    - Add policy to allow users to delete their own saved places
*/

-- Create policy for deleting saved places
CREATE POLICY "Users can delete their own places"
  ON saved_places
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);