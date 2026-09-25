import { requireAdmin } from "@/lib/portal/auth";
import { AdminClientDetail } from "@/components/portal/AdminClients";

// Data loads through SWR, so revisiting a client is instant and saves refresh it in place.
export default async function AdminClientPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  await requireAdmin();
  return <AdminClientDetail clientId={clientId} />;
}
