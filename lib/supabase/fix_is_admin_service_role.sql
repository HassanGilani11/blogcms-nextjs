-- FIX: Handle service_role in is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  -- 1. If we are using the service_role (Admin Client), always return true
  IF (current_setting('role', true) = 'service_role' OR auth.role() = 'service_role') THEN
    RETURN true;
  END IF;

  -- 2. Otherwise check the user's role in the profiles table
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND lower(role) IN ('admin', 'super admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
