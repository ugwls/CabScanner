/*
  # Add user deletion function

  1. New Function
    - `delete_user_account`: Deletes a user's account and all associated data
      - Calls existing delete_user_data function
      - Deletes the user from auth.users

  2. Security
    - Function is SECURITY DEFINER to run with elevated privileges
    - Only authenticated users can call this function
    - Users can only delete their own account
*/

-- Create function to delete user account
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID of the authenticated user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete user data first
  PERFORM delete_user_data(v_user_id);

  -- Delete the user from auth.users
  DELETE FROM auth.users WHERE id = v_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;