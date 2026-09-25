import type { PortalProject } from "@/lib/portal/projects";

export type AdminClientSummary = {
  id: string;
  business_name: string;
  status: string;
  projects: { id: string }[];
  members: { user_id: string }[];
};

export type AdminClientsResponse = { clients: AdminClientSummary[] };

export type AdminClient = {
  id: string;
  business_name: string;
  status: string;
  projects: PortalProject[];
  members: { userId: string; email: string }[];
};

export type AdminClientResponse = { client: AdminClient };

// SWR keys for the admin pages. Admin forms revalidate them after a successful save.
export const adminClientsKey = "/portal/api/admin/clients";
export const adminClientKey = (clientId: string) => `/portal/api/admin/clients/${clientId}`;

export const adminClientPath = (clientId: string) => `/portal/admin/${clientId}`;
