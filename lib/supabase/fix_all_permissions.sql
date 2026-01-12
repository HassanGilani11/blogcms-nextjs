-- COMPREHENSIVE ADMIN PERMISSIONS FIX
-- Run this to ensure Admins can see EVERYTHING

-- 1. POSTS Permissions
drop policy if exists "Admins can view all posts" on public.posts;
drop policy if exists "Admins can manage all posts" on public.posts;

create policy "Admins can view all posts"
  on public.posts for select
  using (
    auth.uid() in (
      select id from public.profiles 
      where role in ('super admin', 'admin', 'editor')
    )
  );

create policy "Admins can manage all posts"
  on public.posts for all
  using (
    auth.uid() in (
      select id from public.profiles 
      where role in ('super admin', 'admin', 'editor')
    )
  );

-- 2. PROFILES Permissions 
-- Ensure admins can read all profiles (needed for 'author' relation)
drop policy if exists "Admins can view all profiles" on public.profiles;

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    auth.uid() in (
      select id from public.profiles 
      where role in ('super admin', 'admin', 'editor')
    )
  );

-- 3. CATEGORIES & TAGS Permissions
-- Usually public, but let's be safe
drop policy if exists "Admins can view all categories" on public.categories;
create policy "Admins can view all categories" on public.categories for select using (true);

drop policy if exists "Admins can view all tags" on public.tags;
create policy "Admins can view all tags" on public.tags for select using (true);

-- 4. RELATION TABLES (post_categories, post_tags, post_likes)
alter table public.post_categories enable row level security;
drop policy if exists "Admins view post_categories" on public.post_categories;
create policy "Admins view post_categories" on public.post_categories for select using (true);

alter table public.post_tags enable row level security;
drop policy if exists "Admins view post_tags" on public.post_tags;
create policy "Admins view post_tags" on public.post_tags for select using (true);

alter table public.post_likes enable row level security;
drop policy if exists "Admins view post_likes" on public.post_likes;
create policy "Admins view post_likes" on public.post_likes for select using (true);

-- 5. SITE SETTINGS
drop policy if exists "Admins view site_settings" on public.site_settings;
create policy "Admins view site_settings" on public.site_settings for select using (true);
