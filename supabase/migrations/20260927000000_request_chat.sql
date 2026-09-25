-- One row per assistant reply in the request chat. Counted to cap AI spend per user.

create table public.request_chat_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index request_chat_usage_user_created_idx on public.request_chat_usage (user_id, created_at);

alter table public.request_chat_usage enable row level security;

-- No update or delete policy, so users can't reset their own count.
create policy "read own chat usage" on public.request_chat_usage
  for select to authenticated using (user_id = (select auth.uid()));
create policy "log own chat usage" on public.request_chat_usage
  for insert to authenticated with check (user_id = (select auth.uid()));
