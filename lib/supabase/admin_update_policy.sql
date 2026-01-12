-- Allow Admins and Super Admins to update any profile
-- This is necessary because by default RLS might only allow users to update their own profile.

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super admin')
);

-- Note: Ensure roles are stored as lowercase 'admin', 'super admin' in your profiles table, 
-- or adjust the string values above to match your database content.
