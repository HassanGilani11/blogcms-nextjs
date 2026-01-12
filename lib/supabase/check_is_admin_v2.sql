-- 1. Test is_admin() for the specific user ID
-- Replace 'USER_ID_HERE' with Hassan's ID: 6c6e2b26-b67c-482c-9e9d-56a091273263
-- We need to see if it returns true.
SELECT public.is_admin() AS result_for_hassangilani
FROM (SELECT '6c6e2b26-b67c-482c-9e9d-56a091273263'::uuid AS id) AS mock_user;

-- Wait, the above doesn't work because auth.uid() is not mocked. Let's inspect the function definition directly.
SELECT pg_get_functiondef(p.oid)
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'is_admin';

-- 2. Check profiles policies in detail
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';
