-- Drop the unused 'views' column from posts table
alter table public.posts drop column if exists views;
