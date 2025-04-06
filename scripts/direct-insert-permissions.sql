-- Simple setup for waitlist_users table with direct insert permissions
-- Run this in the Supabase SQL Editor

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

-- Disable Row Level Security (simplest solution for a public waitlist)
ALTER TABLE public.waitlist_users DISABLE ROW LEVEL SECURITY;

-- Grant access to authenticated and anon users
GRANT ALL ON public.waitlist_users TO authenticated;
GRANT ALL ON public.waitlist_users TO anon; 