create table if not exists public.practice_completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

alter table public.practice_completions enable row level security;

create policy "Users can read their own practice completions"
  on public.practice_completions for select
  using (auth.uid() = user_id);

create policy "Users can create their own practice completions"
  on public.practice_completions for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own practice completions"
  on public.practice_completions for delete
  using (auth.uid() = user_id);

create index if not exists practice_completions_question_id_idx
  on public.practice_completions (question_id);