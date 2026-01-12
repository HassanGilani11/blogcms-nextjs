-- MASTER FIX FOR RLS AND PERMISSIONS
-- This script ensures is_admin() is robust and all policies are clean.

-- 1. Robust is_admin function (Case-Insensitive)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  current_role text;
BEGIN
  SELECT role INTO current_role FROM public.profiles WHERE id = auth.uid();
  RETURN lower(current_role) IN ('admin', 'super admin', 'editor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Clean Categories
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
DROP POLICY IF EXISTS "Public view categories" ON public.categories;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow admin manage categories" ON public.categories FOR ALL USING (public.is_admin());

-- 3. Clean Tags
DROP POLICY IF EXISTS "Admins manage tags" ON public.tags;
DROP POLICY IF EXISTS "Public view tags" ON public.tags;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Allow admin manage tags" ON public.tags FOR ALL USING (public.is_admin());

-- 4. Clean Posts
DROP POLICY IF EXISTS "Admins manage all posts" ON public.posts;
DROP POLICY IF EXISTS "Public view published posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can view all posts" ON public.posts;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select posts" ON public.posts FOR SELECT 
USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Allow admin manage posts" ON public.posts FOR ALL USING (public.is_admin());

-- 5. Clean Profiles
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON public.profiles;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public view profiles" ON public.profiles FOR SELECT USING (true);
