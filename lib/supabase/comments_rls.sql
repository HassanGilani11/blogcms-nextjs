-- Enable RLS (already done by user, but let's be safe)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a new comment (Guest users)
CREATE POLICY "Allow guest comments" ON public.comments
FOR INSERT WITH CHECK (true);

-- Allow anyone to see only approved comments
CREATE POLICY "Allow public to see approved comments" ON public.comments
FOR SELECT USING (status = 'approved');

-- Allow authenticated users (Admins) to manage all comments
CREATE POLICY "Allow admins to manage comments" ON public.comments
FOR ALL TO authenticated USING (true);
