-- CLEANUP: Remove overlapping/conflicting policies completely
-- We saw 7 different policies in the screenshot. We need to consolidate.

-- 1. Drop ALL existing policies on categories (explicitly by name from your screenshot, plus general ones)
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can view all categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public to see categories" ON public.categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Only admins can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Only admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Only admins can update categories" ON public.categories;

-- 2. Define Clean Policies for Categories
-- A. Public Read Access
CREATE POLICY "Public view categories" 
  ON public.categories FOR SELECT 
  USING (true);

-- B. Admin Full Management
CREATE POLICY "Admins manage categories" 
  ON public.categories FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());


-- 3. Cleanup Tags as well (Prevent same issue there)
DROP POLICY IF EXISTS "Admins can manage tags" ON public.tags;
DROP POLICY IF EXISTS "Admins can view all tags" ON public.tags;
DROP POLICY IF EXISTS "Only admins can insert tags" ON public.tags;
DROP POLICY IF EXISTS "Only admins can delete tags" ON public.tags;
DROP POLICY IF EXISTS "Only admins can update tags" ON public.tags;

-- 4. Define Clean Policies for Tags
CREATE POLICY "Public view tags" 
  ON public.tags FOR SELECT 
  USING (true);

CREATE POLICY "Admins manage tags" 
  ON public.tags FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());
