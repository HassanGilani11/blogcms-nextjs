-- 1. Create the many-to-many join table for posts and categories
CREATE TABLE IF NOT EXISTS post_categories (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

-- 2. Migrate existing category_id data from posts table to post_categories
INSERT INTO post_categories (post_id, category_id)
SELECT id, category_id 
FROM posts 
WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 3. (Optional but recommended) Enable RLS for post_categories
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to post_categories
CREATE POLICY "Allow public read access to post_categories"
ON post_categories FOR SELECT
TO anon, authenticated
USING (true);

-- Allow authenticated users (admin) full access
CREATE POLICY "Allow authenticated users full access to post_categories"
ON post_categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- NOTE: You can eventually drop the 'category_id' column from 'posts' table 
-- AFTER confirming that all parts of the application have been updated to use 'post_categories'.
-- ALTER TABLE posts DROP COLUMN category_id;
