/*
  # Create rides and user_rides tables

  1. New Tables
    - `rides`: Stores ride history and details
      - `id` (uuid, primary key)
      - `pickup_location` (text)
      - `dropoff_location` (text)
      - `distance` (text)
      - `duration` (text)
      - `price` (decimal)
      - `provider` (text)
      - `created_at` (timestamp)
    - `user_rides`: Links users to their rides
      - `user_id` (uuid, references auth.users)
      - `ride_id` (uuid, references rides)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

CREATE TABLE rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_location text NOT NULL,
  dropoff_location text NOT NULL,
  distance text NOT NULL,
  duration text NOT NULL,
  price decimal NOT NULL,
  provider text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE user_rides (
  user_id uuid REFERENCES auth.users NOT NULL,
  ride_id uuid REFERENCES rides NOT NULL,
  PRIMARY KEY (user_id, ride_id)
);

ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rides"
  ON rides
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_rides
      WHERE user_rides.ride_id = rides.id
      AND user_rides.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own rides"
  ON rides
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can link rides to themselves"
  ON user_rides
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);