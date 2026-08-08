create extension if not exists pgcrypto;

create table if not exists friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  friend_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, friend_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references profiles(id) on delete cascade,
  recipient_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

alter table friendships enable row level security;
alter table messages enable row level security;

create policy "Users can view their friendships"
on friendships for select
using (auth.uid() = user_id);

create policy "Users can create friendships"
on friendships for insert
with check (auth.uid() = user_id);

create policy "Users can delete their friendships"
on friendships for delete
using (auth.uid() = user_id);

create policy "Users can view their own messages"
on messages for select
using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Users can insert outgoing messages"
on messages for insert
with check (auth.uid() = sender_id);

create policy "Users can update their own message read states"
on messages for update
using (auth.uid() = recipient_id)
with check (auth.uid() = recipient_id);
