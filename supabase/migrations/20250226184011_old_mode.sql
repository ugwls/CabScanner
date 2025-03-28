/*
  # Disable RLS on rides table

  This migration disables row level security on the rides table to allow direct access
  without policy restrictions.
*/

-- Disable RLS on the rides table to allow unrestricted access
ALTER TABLE rides DISABLE ROW LEVEL SECURITY;