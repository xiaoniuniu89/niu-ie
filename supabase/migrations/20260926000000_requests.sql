-- Client requests (R1): each row mirrors a GitHub issue on the project's repo.
-- GitHub is the source of truth for status; the row keeps what the client wrote.

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  created_by uuid references auth.users (id) on delete set null,
  type text not null check (type in ('change', 'bug', 'question')),
  title text not null,
  page_url text,
  current text not null,
  expected text not null,
  gh_issue_number integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.request_files (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  path text not null unique,  -- "<client_id>/<uuid>-<filename>" in the request-files bucket
  filename text not null,
  mime text not null,
  size integer not null,
  created_at timestamptz not null default now()
);

create index requests_project_id_idx on public.requests (project_id);
create index request_files_request_id_idx on public.request_files (request_id);

alter table public.requests enable row level security;
alter table public.request_files enable row level security;

create policy "read own requests" on public.requests
  for select to authenticated using (public.is_member(client_id) or public.is_admin());
create policy "members create requests" on public.requests
  for insert to authenticated
  with check ((public.is_member(client_id) or public.is_admin()) and created_by = (select auth.uid()));
create policy "members update requests" on public.requests
  for update to authenticated
  using (public.is_member(client_id) or public.is_admin())
  with check (public.is_member(client_id) or public.is_admin());

create policy "read own request files" on public.request_files
  for select to authenticated using (public.is_member(client_id) or public.is_admin());
create policy "members add request files" on public.request_files
  for insert to authenticated
  with check (
    (public.is_member(client_id) or public.is_admin())
    and split_part(path, '/', 1) = client_id::text
  );

-- Private bucket. Files are only served through /portal/files/[id] as short-lived signed URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('request-files', 'request-files', false, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf']);

-- First folder of the object path is the client id.
create policy "members upload request files" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'request-files'
    and (public.is_member(((storage.foldername(name))[1])::uuid) or public.is_admin())
  );
create policy "members read request files" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'request-files'
    and (public.is_member(((storage.foldername(name))[1])::uuid) or public.is_admin())
  );
