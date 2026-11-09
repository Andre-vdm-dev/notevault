-- notes table, each note belongs to one user
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- turn on row level security
alter table public.notes enable row level security;

-- users can only see their own notes
create policy "Users can view own notes"
  on public.notes for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- users can only add notes for themselves
create policy "Users can create own notes"
  on public.notes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- users can only edit their own notes
create policy "Users can update own notes"
  on public.notes for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- users can only delete their own notes
create policy "Users can delete own notes"
  on public.notes for delete
  to authenticated
  using ((select auth.uid()) = user_id);