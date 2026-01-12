-- Drop the existing check constraint
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add the new check constraint with all allowed roles
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('super admin', 'admin', 'editor', 'author', 'subscriber', 'user'));

-- Note: 'user' is included for backward compatibility during migration, 
-- though the UI now maps it to 'subscriber'.
