import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireAdmin } from "@/lib/portal/auth";
import { NewClientForm, PasswordForm } from "@/components/portal/AdminForms";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, business_name, status, projects (id), members (user_id)")
    .order("business_name");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Admin</h1>
        <p className="mt-1 text-muted-foreground">Pick a client to edit their details, people and projects.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Clients</h2>
        {!clients?.length && <p className="mt-2 text-muted-foreground">None yet. Create one below.</p>}
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
          {clients?.map((c) => (
            <li key={c.id}>
              <Link
                href={`/portal/admin/${c.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50"
              >
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
      </section>

      <section className="max-w-sm rounded-lg border border-border bg-card p-4">
        <h2 className="mb-3 font-semibold">New client</h2>
        <NewClientForm />
      </section>

      <section className="max-w-sm rounded-lg border border-border bg-card p-4">
        <h2 className="font-semibold">Your password</h2>
        <p className="mb-3 mt-1 text-sm text-muted-foreground">
          Lets you sign in with a password instead of waiting for an email.
        </p>
        <PasswordForm />
      </section>
    </div>
  );
}

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
