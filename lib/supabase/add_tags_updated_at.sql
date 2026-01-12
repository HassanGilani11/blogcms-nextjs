-- Add updated_at column to tags table
ALTER TABLE public.tags 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Optional: Create a trigger to automatically update this column
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_tags_modtime ON public.tags;
CREATE TRIGGER update_tags_modtime 
    BEFORE UPDATE ON public.tags 
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
