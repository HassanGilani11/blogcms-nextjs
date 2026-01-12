-- Create site_settings table
CREATE TABLE public.site_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    site_name TEXT DEFAULT 'BlogCMS',
    admin_email TEXT,
    site_description TEXT,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    youtube_url TEXT,
    github_url TEXT,
    maintenance_mode BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial default row
INSERT INTO public.site_settings (id, site_name)
VALUES (1, 'BlogCMS')
ON CONFLICT (id) DO NOTHING;
