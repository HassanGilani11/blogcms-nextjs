-- Fix Category and Tag Permissions
-- Allows admins to Manage (Insert/Update/Delete) categories and tags.
-- Requires public.is_admin() function to exist (created in previous step).

-- 1. CATEGORIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
  ON public.categories
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2. TAGS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage tags" ON public.tags;
CREATE POLICY "Admins can manage tags"
  ON public.tags
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
