/*
  # Enable user-specific ride history with RLS
  
  1. Changes
     - Enable Row Level Security (RLS) on rides table
     - Create policy to allow users to insert their own rides
     - Create policy to allow users to view only their own rides
     - Create index for better query performance
  
  2. Security
     - Each user can only access their own ride history
     - Prevents unauthorized access to other users' ride data
*/

-- Enable RLS on rides table
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own rides
CREATE POLICY "Users can insert their own rides"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to view only their own rides
CREATE POLICY "Users can view their own rides"
  ON rides
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better query performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON rides(user_id);