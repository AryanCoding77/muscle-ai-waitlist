-- Create the waitlist_users table with proper permissions
-- Run this in your Supabase SQL Editor

-- Create extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop the table if it exists to ensure a clean start
DROP TABLE IF EXISTS public.waitlist_users;

-- Create the waitlist_users table
CREATE TABLE public.waitlist_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

-- Grant access to authenticated and anon users
GRANT ALL ON public.waitlist_users TO authenticated;
GRANT ALL ON public.waitlist_users TO anon;

-- Enable Row Level Security
ALTER TABLE public.waitlist_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (anonymous users)
CREATE POLICY insert_policy ON public.waitlist_users 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy to allow admin users to view all data
CREATE POLICY select_policy ON public.waitlist_users 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Return success message
DO $$ 
BEGIN
  RAISE NOTICE 'Waitlist table created successfully!';
END $$; 