-- Drop the existing function
DROP FUNCTION IF EXISTS delete_user_data(uuid);

-- Recreate the function with fixed column references
CREATE OR REPLACE FUNCTION delete_user_data(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete user's rides (using explicit table references)
  DELETE FROM rides r
  WHERE r.id IN (
    SELECT ur.ride_id 
    FROM user_rides ur 
    WHERE ur.user_id = p_user_id
  );
  
  -- Delete user's saved places
  DELETE FROM saved_places sp
  WHERE sp.user_id = p_user_id;
  
  -- Delete user's profile
  DELETE FROM profiles p
  WHERE p.id = p_user_id;
  
  -- Delete avatar from storage
  DELETE FROM storage.objects o
  WHERE o.bucket_id = 'avatars'
  AND (storage.foldername(o.name))[1] = p_user_id::text;
END;
$$;