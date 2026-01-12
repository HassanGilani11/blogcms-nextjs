-- CLEANUP: Remove conflicting policies on POSTS table
-- The screenshot showed ~9 active policies. We need to reset to a clean state.

-- 1. Drop ALL existing policies on posts
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can view their own posts" ON public.posts;
DROP POLICY IF EXISTS "Only admins can delete posts" ON public.posts;
DROP POLICY IF EXISTS "Only admins can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Only admins can update posts" ON public.posts;
DROP POLICY IF EXISTS "Only admins can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON public.posts;

-- 2. Define Clean Policies for Posts

-- A. Public Read Access
-- Public can only see posts that are Published AND not Deleted
CREATE POLICY "Public view published posts" 
  ON public.posts FOR SELECT 
  USING (status = 'published' AND deleted_at IS NULL);

-- B. Admin Full Management
-- Admins (and super admins/editors) can view and edit ALL posts
CREATE POLICY "Admins manage all posts" 
  ON public.posts FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());
