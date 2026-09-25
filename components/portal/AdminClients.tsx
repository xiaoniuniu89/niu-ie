"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import useSWR from "swr";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  adminClientKey,
  adminClientPath,
  adminClientsKey,
  type AdminClientResponse,
  type AdminClientsResponse,
} from "@/lib/portal/admin";
import {
  ClientDetailsForm,
  DeleteProjectButton,
  InviteForm,
  ProjectForm,
  RemoveMemberButton,
} from "@/components/portal/AdminForms";

export function AdminClientList() {
  const { data, error } = useSWR<AdminClientsResponse>(adminClientsKey);

  if (error) return <p className="mt-4 text-sm text-destructive">Couldn&apos;t load clients. Refresh to try again.</p>;
  if (!data) return <div className="mt-4 h-40 animate-pulse rounded-lg border bg-muted/40" aria-busy="true" />;
  if (!data.clients.length) return <p className="mt-2 text-muted-foreground">None yet. Create one below.</p>;

  return (
    <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
      {data.clients.map((c) => (
        <li key={c.id}>
          <Link href={adminClientPath(c.id)} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50">
            <span>
              <span className="font-medium">{c.business_name}</span>
              <span className="ml-3 text-sm text-muted-foreground">
                {plural(c.projects.length, "project")} · {plural(c.members.length, "person", "people")}
              </span>
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              {c.status !== "active" && c.status}
              <ChevronRight className="size-4" aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function AdminClientDetail({ clientId }: { clientId: string }) {
  const { data, error } = useSWR<AdminClientResponse>(adminClientKey(clientId));

  if (error?.message.endsWith("404")) notFound();
  if (error) return <p className="text-sm text-destructive">Couldn&apos;t load this client. Refresh to try again.</p>;
  if (!data) return <AdminClientSkeleton />;

  const { client } = data;
  return (
    <div className="space-y-8">
      <div>
        <BackLink />
        <h1 className="mt-2 font-serif text-2xl font-semibold">{client.business_name}</h1>
      </div>

      <Section title="Details">
        <div className="max-w-sm">
          <ClientDetailsForm id={client.id} name={client.business_name} status={client.status} />
        </div>
      </Section>

      <Section title="People" description="Everyone here can sign in and see this client's projects.">
        {client.members.length > 0 && (
          <ul className="mb-4 divide-y divide-border">
            {client.members.map((m) => (
              <li key={m.userId} className="flex items-center justify-between gap-4 py-2">
                <span className="text-sm">{m.email}</span>
                <RemoveMemberButton clientId={client.id} userId={m.userId} email={m.email} />
              </li>
            ))}
          </ul>
        )}
        <div className="max-w-sm">
          <InviteForm clientId={client.id} />
        </div>
      </Section>

      <Section title="Projects">
        <div className="space-y-4">
          {client.projects.map((p) => (
            <div key={p.id} className="rounded-md border border-border p-4">
              <h3 className="mb-3 font-medium">{p.name}</h3>
              <ProjectForm clientId={client.id} project={p} />
              <div className="mt-4 border-t border-border pt-4">
                <DeleteProjectButton clientId={client.id} projectId={p.id} name={p.name} />
              </div>
            </div>
          ))}
          <div className="rounded-md border border-dashed border-border p-4">
            <h3 className="mb-3 font-medium">Add a project</h3>
            <ProjectForm clientId={client.id} />
          </div>
        </div>
      </Section>
    </div>
  );
}

export function AdminClientSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true">
      <div>
        <BackLink />
        <div className="mt-2 h-8 w-64 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="h-40 animate-pulse rounded-lg border bg-muted/40" />
      <div className="h-40 animate-pulse rounded-lg border bg-muted/40" />
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/portal/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ChevronLeft className="size-4" aria-hidden />
      All clients
    </Link>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
