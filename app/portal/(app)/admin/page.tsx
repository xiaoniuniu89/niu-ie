import { requireAdmin } from "@/lib/portal/auth";
import { NewClientForm } from "@/components/portal/AdminForms";
import { AdminClientList } from "@/components/portal/AdminClients";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Admin</h1>
        <p className="mt-1 text-muted-foreground">Pick a client to edit their details, people and projects.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Clients</h2>
        <AdminClientList />
      </section>

      <section className="max-w-sm rounded-lg border border-border bg-card p-4">
        <h2 className="mb-3 font-semibold">New client</h2>
        <NewClientForm />
      </section>
    </div>
  );
}
