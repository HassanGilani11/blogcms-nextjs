-- 1. Ensure users can view their own profile
-- This is critical so that the login action can read the user's role.
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- 2. Update the target user to be an admin
-- Please make sure the email matches your account.
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'm@example.com';
