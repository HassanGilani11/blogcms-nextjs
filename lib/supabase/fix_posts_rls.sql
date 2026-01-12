
-- Enable RLS on posts if not already (it should be)
alter table public.posts enable row level security;

-- Policy for Public to view PUBLISHED posts
create policy "Public can view published posts"
  on public.posts for select
  using (status = 'published' and deleted_at is null);

-- Policy for Admins to view ALL posts
create policy "Admins can view all posts"
  on public.posts for select
  using (
    auth.uid() in (
      select id from public.profiles 
      where role in ('super admin', 'admin', 'editor')
    )
  );

-- Policy for Admins to insert/update/delete posts
create policy "Admins can manage all posts"
  on public.posts for all
  using (
    auth.uid() in (
      select id from public.profiles 
      where role in ('super admin', 'admin', 'editor')
    )
  );
