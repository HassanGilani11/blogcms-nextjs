-- FINAL MASTER FIX FOR RLS AND PERMISSIONS
-- This script fixes the is_admin() function for service_role and cleans all policies.

-- 1. Redefine is_admin to handle service_role and case-insensitivity
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  -- Bypass for Service Role (Admin Client)
  IF (current_setting('role', true) = 'service_role' OR auth.role() = 'service_role') THEN
    RETURN true;
  END IF;

  -- Check for authenticated user role
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND lower(role) IN ('admin', 'super admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Clean Posts
DROP POLICY IF EXISTS "Allow admin manage posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public select posts" ON public.posts;
DROP POLICY IF EXISTS "Admins manage all posts" ON public.posts;
DROP POLICY IF EXISTS "Public view published posts" ON public.posts;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view posts" ON public.posts FOR SELECT 
USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Admins manage posts" ON public.posts FOR ALL 
USING (public.is_admin());

-- 3. Clean Categories
DROP POLICY IF EXISTS "Allow admin manage categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public select categories" ON public.categories;
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
DROP POLICY IF EXISTS "Public view categories" ON public.categories;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin());

-- 4. Clean Tags
DROP POLICY IF EXISTS "Allow admin manage tags" ON public.tags;
DROP POLICY IF EXISTS "Allow public select tags" ON public.tags;
DROP POLICY IF EXISTS "Admins manage tags" ON public.tags;
DROP POLICY IF EXISTS "Public view tags" ON public.tags;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins manage tags" ON public.tags FOR ALL USING (public.is_admin());

-- 5. Clean Profiles
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public view profiles" ON public.profiles;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Public view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
