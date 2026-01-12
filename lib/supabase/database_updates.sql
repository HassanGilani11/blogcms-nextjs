-- Run this SQL in your Supabase SQL Editor
-- This adds the 'views' column to track post engagement
ALTER TABLE posts ADD COLUMN views INTEGER DEFAULT 0;

-- Also adding the icon_url to categories if you haven't run it yet
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_url TEXT;
