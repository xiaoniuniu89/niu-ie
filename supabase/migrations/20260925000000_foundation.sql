-- Portal foundation: clients, members, projects, admins.
-- RLS: members see only their client's rows. Admins see everything.

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

create table public.members (
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, client_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  repo text,             -- "owner/name"
  vercel_project text,
  live_url text,
  preview_url text,
  status text not null default 'in_progress' check (status in ('planning', 'in_progress', 'live', 'maintenance')),
  created_at timestamptz not null default now()
);

create index projects_client_id_idx on public.projects (client_id);
create index members_client_id_idx on public.members (client_id);

-- security definer so policies can check membership without recursive RLS.
create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

create function public.is_member(target_client uuid) returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.members
    where client_id = target_client and user_id = (select auth.uid())
  );
$$;

alter table public.admins enable row level security;
alter table public.clients enable row level security;
alter table public.members enable row level security;
alter table public.projects enable row level security;

create policy "admins read self" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

create policy "read own client" on public.clients
  for select to authenticated using (public.is_member(id) or public.is_admin());
create policy "admin writes clients" on public.clients
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "read own membership" on public.members
  for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
create policy "admin writes members" on public.members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "read own projects" on public.projects
  for select to authenticated using (public.is_member(client_id) or public.is_admin());
create policy "admin writes projects" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
