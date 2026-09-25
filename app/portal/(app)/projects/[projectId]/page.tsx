import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireUser } from "@/lib/portal/auth";
import { RequestDialog } from "@/components/portal/RequestForms";
import { RequestList } from "@/components/portal/RequestList";
import { Button } from "@/components/ui/button";

export default async function ProjectRequestsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { supabase } = await requireUser();

  // RLS: members see their own client's project only. Requests load client-side via SWR.
  const { data: project } = await supabase
    .from("projects")
    .select("id, client_id, name, repo")
    .eq("id", projectId)
    .maybeSingle();
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <Link href="/portal" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Overview
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-semibold">{project.name}: requests</h1>
        {project.repo && (
          <RequestDialog projectId={project.id} clientId={project.client_id} trigger={<Button>Report an issue</Button>} />
        )}
      </div>

      {project.repo ? (
        <RequestList projectId={project.id} clientId={project.client_id} />
      ) : (
        <p className="text-muted-foreground">Requests aren&apos;t set up for this project yet. Email Daniel in the meantime.</p>
      )}
    </div>
  );
}
