-- Function to safely increment post views
create or replace function increment_post_views(post_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.posts
  set view_count = coalesce(view_count, 0) + 1
  where id = post_id;
end;
$$;
