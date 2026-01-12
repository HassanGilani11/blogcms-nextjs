-- Move data from image_url to icon_url if icon_url is empty
UPDATE categories 
SET icon_url = image_url 
WHERE icon_url IS NULL AND image_url IS NOT NULL;

-- Remove the redundant image_url column
ALTER TABLE categories DROP COLUMN image_url;
