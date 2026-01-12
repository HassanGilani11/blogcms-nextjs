-- FINAL CLEANUP: Resolve Categorization Ambiguity 🛠️
-- Run this AFTER you have run post_categories.sql

-- 1. Drop the old category_id column from the posts table.
-- It is now redundant because we use the post_categories join table.
-- This will permanently fix the "more than one relationship found" error.
ALTER TABLE posts DROP COLUMN IF EXISTS category_id CASCADE;

-- 2. Verify settings (Optional)
-- This ensures the schema cache is refreshed in PostgREST.
-- In some cases, you might need to wait 30 seconds or refresh your Supabase dashboard.
