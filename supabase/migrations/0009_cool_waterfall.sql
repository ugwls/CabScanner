/*
  # Add updated_at column to saved_places

  1. Changes
    - Add updated_at column to saved_places table
    - Set default value to now()
    - Update trigger to maintain updated_at
*/

-- Add updated_at column
ALTER TABLE saved_places 
ADD COLUMN updated_at timestamptz DEFAULT now();

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to maintain updated_at
CREATE TRIGGER update_saved_places_updated_at
    BEFORE UPDATE ON saved_places
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();