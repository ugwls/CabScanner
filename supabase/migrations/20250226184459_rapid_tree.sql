/*
  # Fix Row Level Security for Rides Table
  
  1. Changes
     - Disable and re-enable RLS on rides table to ensure clean state
     - Create proper policies for authenticated users
     - Ensure user_id is properly set and checked
  
  2. Security
     - Each user can only access their own ride history
     - Prevents unauthorized access to other users' ride data
*/

-- First disable RLS to start fresh
ALTER TABLE rides DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own rides" ON rides;
DROP POLICY IF EXISTS "Users can view their own rides" ON rides;

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