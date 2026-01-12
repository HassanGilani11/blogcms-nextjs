-- Fix Infinite Recursion in Profiles RLS
-- We use a SECURITY DEFINER function to bypass RLS when checking roles.

-- 1. Create a helper function to check admin status safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  current_role text;
BEGIN
  SELECT role INTO current_role FROM public.profiles WHERE id = auth.uid();
  RETURN current_role IN ('admin', 'super admin', 'editor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;

-- 3. Re-create policies using the safe function
-- PROFILES
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- POSTS (Update these too just in case)
CREATE POLICY "Admins can view all posts"
  ON public.posts FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage all posts"
  ON public.posts FOR ALL
  USING (public.is_admin());
