-- 1. Inspect the trigger functions
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_name IN ('update_updated_at_column', 'update_modified_column');

-- 2. Check RLS policies for categories
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'categories';
