-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (SELECT)
-- Allows everyone (including anonymous guests) to read site settings
CREATE POLICY "Allow public read access"
ON public.site_settings
FOR SELECT
TO public
USING (true);

-- Policy for admin write access (UPDATE)
-- Allows only authenticated users with 'admin' or 'super admin' role to update settings
CREATE POLICY "Allow admin update access"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.role = 'super admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.role = 'super admin')
    )
);

-- Policy for admin insert access (INSERT)
-- Since we use upsert, we might need insert permission for the initial row (id=1)
-- although it's usually pre-inserted.
CREATE POLICY "Allow admin insert access"
ON public.site_settings
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.role = 'super admin')
    )
);
