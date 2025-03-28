/*
  # Add saved places functionality
  
  1. New Tables
    - `saved_places`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `address` (text)
      - `created_at` (timestamp)
*/

CREATE TABLE saved_places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  created_at timestamptz DEFAULT now()
);