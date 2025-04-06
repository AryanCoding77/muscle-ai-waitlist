-- Create a function to add users to the waitlist that bypasses RLS
-- Run this in the Supabase SQL Editor

-- First, create or recreate the waitlist_users table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS public.waitlist_users;

CREATE TABLE public.waitlist_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

-- Create the function to add users to the waitlist
CREATE OR REPLACE FUNCTION public.add_to_waitlist(user_name text, user_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with the privileges of the creator
AS $$
DECLARE
  new_id uuid;
BEGIN
  -- Insert the new user
  INSERT INTO public.waitlist_users (name, email)
  VALUES (user_name, user_email)
  RETURNING id INTO new_id;
  
  -- Return success
  RETURN json_build_object(
    'success', true,
    'id', new_id
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN json_build_object(
      'success', false,
      'error', 'This email is already on our waitlist!'
    );
  WHEN others THEN
    RETURN json_build_object(
      'success', false,
      'error', 'An error occurred while adding to the waitlist.'
    );
END;
$$;

-- Grant execute permission to the function for anonymous users
GRANT EXECUTE ON FUNCTION public.add_to_waitlist TO anon, authenticated; 