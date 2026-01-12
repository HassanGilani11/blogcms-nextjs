-- 1. Check if the post exists and what its actual ID is
SELECT id, title, slug, status, author_id 
FROM public.posts 
WHERE id = '83585958-db34-4ceb-9af2-7e94508e593b';

-- 2. Check if there are any posts with a similar title but different ID
SELECT id, title 
FROM public.posts 
WHERE title ILIKE '%Google Confirms Core%';

-- 3. Check for any active locks on the posts table
SELECT pid, mode, granted 
FROM pg_locks 
WHERE relation = 'posts'::regclass;
