import { AdminClientSkeleton } from "@/components/portal/AdminClients";

// Shown the moment a client is clicked, while the server checks admin access.
export default function AdminClientLoading() {
  return <AdminClientSkeleton />;
}
