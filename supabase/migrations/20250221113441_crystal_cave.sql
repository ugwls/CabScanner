/*
  # Fix delete user data function

  1. Changes
    - Make delete_user_data function more resilient by checking if tables exist
    - Add explicit error handling
    - Improve transaction handling
  
  2. Security
    - Maintain SECURITY DEFINER
    - Keep existing RLS policies
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS delete_user_data(uuid);

-- Create a more resilient version of the function
CREATE OR REPLACE FUNCTION delete_user_data(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete user's rides
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_rides') THEN
    DELETE FROM rides r
    WHERE r.id IN (
      SELECT ur.ride_id 
      FROM user_rides ur 
      WHERE ur.user_id = p_user_id
    );
  END IF;
  
  -- Delete user's saved places
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'saved_places') THEN
    DELETE FROM saved_places sp
    WHERE sp.user_id = p_user_id;
  END IF;
  
  -- Delete user's profile if the table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    DELETE FROM profiles p
    WHERE p.id = p_user_id;
  END IF;
  
  -- Delete avatar from storage if the bucket exists
  IF EXISTS (
    SELECT 1 FROM storage.buckets 
    WHERE id = 'avatars'
  ) THEN
    DELETE FROM storage.objects o
    WHERE o.bucket_id = 'avatars'
    AND (storage.foldername(o.name))[1] = p_user_id::text;
  END IF;

EXCEPTION WHEN OTHERS THEN
  -- Log the error and re-raise
  RAISE NOTICE 'Error in delete_user_data: %', SQLERRM;
  RAISE;
END;
$$;