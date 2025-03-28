/*
  # Fix ride save functionality

  1. Changes
    - Add stored procedure to handle ride saving transaction
    - Ensure atomic operation for ride creation and user linking
    - Maintain RLS security while allowing procedure to work

  2. Security
    - Procedure runs with SECURITY DEFINER to bypass RLS
    - Input validation ensures user can only save their own rides
*/

-- Create a function to save a ride and link it to a user atomically
CREATE OR REPLACE FUNCTION save_ride_with_user(
  p_pickup_location text,
  p_dropoff_location text,
  p_distance text,
  p_duration text,
  p_price decimal,
  p_provider text,
  p_user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ride_id uuid;
  v_created_ride rides%ROWTYPE;
BEGIN
  -- Verify the user exists and matches the authenticated user
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: User ID mismatch';
  END IF;

  -- Insert the ride
  INSERT INTO rides (
    pickup_location,
    dropoff_location,
    distance,
    duration,
    price,
    provider
  ) VALUES (
    p_pickup_location,
    p_dropoff_location,
    p_distance,
    p_duration,
    p_price,
    p_provider
  )
  RETURNING id INTO v_ride_id;

  -- Link the ride to the user
  INSERT INTO user_rides (user_id, ride_id)
  VALUES (p_user_id, v_ride_id);

  -- Get the created ride details
  SELECT * INTO v_created_ride
  FROM rides
  WHERE id = v_ride_id;

  -- Return the ride details as JSON
  RETURN row_to_json(v_created_ride);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION save_ride_with_user TO authenticated;