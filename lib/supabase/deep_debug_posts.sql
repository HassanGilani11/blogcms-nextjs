-- DEEP DEBUG: Check permissions, triggers, and force update

-- 1. Check if the database thinks you are an admin
-- (This relies on the session, so running in SQL editor might return false if 'auth.uid()' is null, 
--  but we can check the profile directly).
SELECT id, email, role FROM public.profiles WHERE role IN ('admin', 'super admin');

-- 2. Check for any "Hidden" Triggers on posts table that might be reverting changes
SELECT event_object_table, trigger_name, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'posts';

-- 3. Force a Direct SQL Update (Bypassing RLS if run by superuser in Dashboard)
-- Let's try to update that specific post.
UPDATE public.posts 
SET title = 'SQL FORCED UPDATE: Google Confirms Core Update',
    updated_at = now()
WHERE id = '83585958-db34-4ceb-9af2-7e94508e593b';

-- 4. Check if the update stuck
SELECT id, title, updated_at FROM public.posts 
WHERE id = '83585958-db34-4ceb-9af2-7e94508e593b';
