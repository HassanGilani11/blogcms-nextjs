-- Drop bio column from profiles table as professional_bio already exists
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS bio;

-- Notify user to run this in Supabase SQL Editor
