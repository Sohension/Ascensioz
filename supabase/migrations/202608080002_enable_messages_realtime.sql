-- Enable Realtime on the messages table so users receive live chat updates.
-- Supabase exposes the `supabase_realtime` publication for this purpose.

-- 1) Add RLS helper function (used by realtime auth checks) if not present.
--    This is idempotent and safe to run multiple times.
create or replace function public.is_user_in_conversation(
  sender uuid,
  recipient uuid
) returns boolean
  language sql
  stable
as $$
  select auth.uid() = sender or auth.uid() = recipient;
$$;

-- 2) Add the messages table to the realtime publication.
alter publication supabase_realtime add table public.messages;

-- 3) Add the friendships table to the realtime publication (for presence/status
--    and future friend-list updates). If it is already a member, this is a no-op.
alter publication supabase_realtime add table public.friendships;

-- 4) Index for fast conversation lookups (both directions).
create index if not exists messages_conversation_idx
  on public.messages (sender_id, recipient_id);

create index if not exists messages_recipient_sender_idx
  on public.messages (recipient_id, sender_id);

create index if not exists messages_created_at_idx
  on public.messages (created_at);
