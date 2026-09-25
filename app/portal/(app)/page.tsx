import { requireUser } from "@/lib/portal/auth";
import { ProjectOverview } from "@/components/portal/ProjectOverview";

export default async function OverviewPage() {
  // Shares the layout's cached auth check. Projects load client-side through SWR.
  const { isAdmin } = await requireUser();
  return <ProjectOverview isAdmin={isAdmin} />;
}
