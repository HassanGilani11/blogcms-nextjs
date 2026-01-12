-- Create post_likes table
create table if not exists public.post_likes (
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (post_id, user_id)
);

-- Enable RLS
alter table public.post_likes enable row level security;

-- Policies
create policy "Users can view all likes"
  on public.post_likes for select
  using (true);

create policy "Users can insert their own likes"
  on public.post_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own likes"
  on public.post_likes for delete
  using (auth.uid() = user_id);
