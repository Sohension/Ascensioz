create table if not exists user_guns (
  user_id uuid not null references profiles(id) on delete cascade,
  gun_id text not null,
  purchased_at timestamptz not null default now(),
  primary key (user_id, gun_id)
);

alter table user_guns enable row level security;

create policy "Users can view their own guns"
on user_guns for select
using (auth.uid() = user_id);

create policy "Users can purchase guns"
on user_guns for insert
with check (auth.uid() = user_id);