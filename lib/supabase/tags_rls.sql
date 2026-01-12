-- Enable RLS for tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Allow public to see tags
CREATE POLICY "Allow public to see tags"
ON public.tags
FOR SELECT
USING (true);

-- Enable RLS for post_tags
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- Allow public to see post_tags
CREATE POLICY "Allow public to see post_tags"
ON public.post_tags
FOR SELECT
USING (true);

-- Also ensure categories are visible just in case
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to see categories"
ON public.categories
FOR SELECT
USING (true);
