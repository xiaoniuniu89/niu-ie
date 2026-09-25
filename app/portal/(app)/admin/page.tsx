import { requireAdmin } from "@/lib/portal/auth";
import { createAdminClient } from "@/lib/portal/supabase/admin";
import { AdminForms } from "@/components/portal/AdminForms";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, business_name, status, projects (id, name, repo, live_url), members (user_id)")
    .order("business_name");

  // Member emails live in auth.users, which only the secret key can read.
  const { data: users } = await createAdminClient().auth.admin.listUsers({ perPage: 1000 });
  const emailById = new Map(users.users.map((u) => [u.id, u.email ?? u.id]));

  return (
    <div className="space-y-10">
      <h1 className="font-serif text-2xl font-semibold">Admin</h1>

      <AdminForms clients={(clients ?? []).map((c) => ({ id: c.id, name: c.business_name }))} />

      <section>
        <h2 className="text-lg font-semibold">Clients</h2>
        {!clients?.length && <p className="mt-2 text-muted-foreground">None yet.</p>}
        <ul className="mt-4 space-y-4">
          {clients?.map((c) => (
            <li key={c.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{c.business_name}</span>
                <span className="text-xs text-muted-foreground">{c.status}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                People: {c.members.map((m) => emailById.get(m.user_id)).join(", ") || "none"}
              </p>
              <p className="text-sm text-muted-foreground">
                Projects: {c.projects.map((p) => p.repo ?? p.name).join(", ") || "none"}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
