-- Add bio column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio text;

-- Notify user to run this in Supabase SQL Editor
-- This adds the bio column which is required for the user profile edit page.
