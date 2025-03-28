/*
  # Add coordinates to saved places

  1. Changes
    - Add latitude and longitude columns to saved_places table
    - Add RLS policies for saved_places table
*/

-- Add coordinates columns
ALTER TABLE saved_places
ADD COLUMN latitude double precision,
ADD COLUMN longitude double precision;

-- Enable RLS
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own places"
  ON saved_places
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own places"
  ON saved_places
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);