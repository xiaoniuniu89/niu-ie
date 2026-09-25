import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireAdmin } from "@/lib/portal/auth";
import { createAdminClient } from "@/lib/portal/supabase/admin";
import {
  ClientDetailsForm,
  DeleteProjectButton,
  InviteForm,
  ProjectForm,
  RemoveMemberButton,
} from "@/components/portal/AdminForms";

export default async function AdminClientPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const { supabase } = await requireAdmin();

  const { data: client } = await supabase
    .from("clients")
    .select("id, business_name, status, projects (id, name, repo, live_url, preview_url, status), members (user_id)")
    .eq("id", clientId)
    .order("created_at", { referencedTable: "projects" })
    .maybeSingle();
  if (!client) notFound();

  // Member emails live in auth.users, which only the secret key can read.
  const admin = createAdminClient();
  const members = await Promise.all(
    client.members.map(async (m) => {
      const { data } = await admin.auth.admin.getUserById(m.user_id);
      return { userId: m.user_id, email: data.user?.email ?? m.user_id };
    })
  );

  return (
    <div className="space-y-8">
      <div>
        <Link href="/portal/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" aria-hidden />
          All clients
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-semibold">{client.business_name}</h1>
      </div>

      <Section title="Details">
        <div className="max-w-sm">
          <ClientDetailsForm id={client.id} name={client.business_name} status={client.status} />
        </div>
      </Section>

      <Section title="People" description="Everyone here can sign in and see this client's projects.">
        {members.length > 0 && (
          <ul className="mb-4 divide-y divide-border">
            {members.map((m) => (
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

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
