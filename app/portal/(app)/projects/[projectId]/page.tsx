import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireUser } from "@/lib/portal/auth";
import { portalIssueStatuses, type RequestStatus } from "@/lib/portal/github";
import { REQUEST_STATUS_LABEL, REQUEST_TYPES } from "@/lib/portal/requests";
import { CancelRequestButton, RequestDialog } from "@/components/portal/RequestForms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_VARIANT: Record<RequestStatus, "default" | "secondary" | "outline"> = {
  open: "secondary",
  in_progress: "default",
  done: "outline",
  cancelled: "outline",
};

export default async function ProjectRequestsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { supabase } = await requireUser();

  // RLS: members see their own client's project and requests only.
  const { data: project } = await supabase
    .from("projects")
    .select(
      "id, client_id, name, repo, live_url, requests (id, type, title, page_url, current, expected, gh_issue_number, created_at, request_files (id, filename, mime))"
    )
    .eq("id", projectId)
    .order("created_at", { referencedTable: "requests", ascending: false })
    .maybeSingle();
  if (!project) notFound();

  let statuses = new Map<number, RequestStatus>();
  let statusError = false;
  if (project.repo && project.requests.length) {
    try {
      statuses = await portalIssueStatuses(
        project.repo,
        project.requests.flatMap((r) => (r.gh_issue_number ? [r.gh_issue_number] : []))
      );
    } catch (e) {
      console.error(e);
      statusError = true;
    }
  }

  const reportButton = project.repo && (
    <RequestDialog
      projectId={project.id}
      clientId={project.client_id}
      liveUrl={project.live_url}
      trigger={<Button>Report an issue</Button>}
    />
  );

  return (
    <div className="space-y-6">
      <Link href="/portal" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Overview
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-semibold">{project.name}: requests</h1>
        {reportButton}
      </div>

      {!project.repo && (
        <p className="text-muted-foreground">Requests aren&apos;t set up for this project yet. Email Daniel in the meantime.</p>
      )}
      {statusError && <p className="text-sm text-destructive">Couldn&apos;t check the latest status. Try again shortly.</p>}
      {project.repo && project.requests.length === 0 && (
        <p className="text-muted-foreground">No requests yet. Use &ldquo;Report an issue&rdquo; to send the first one.</p>
      )}

      <div className="space-y-4">
        {project.requests.map((request) => {
          const status = request.gh_issue_number ? statuses.get(request.gh_issue_number) : undefined;
          const typeLabel = REQUEST_TYPES.find(([value]) => value === request.type)?.[1];
          return (
            <Card key={request.id}>
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-lg">
                  {request.title}
                  {status && <Badge variant={STATUS_VARIANT[status]}>{REQUEST_STATUS_LABEL[status]}</Badge>}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {typeLabel} · Sent {new Date(request.created_at).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" })}
                  {request.page_url && (
                    <>
                      {" · "}
                      <a href={request.page_url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                        {request.page_url.replace(/^https?:\/\//, "")}
                      </a>
                    </>
                  )}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="font-medium">What happens now</p>
                    <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{request.current}</p>
                  </div>
                  <div>
                    <p className="font-medium">What should happen</p>
                    <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{request.expected}</p>
                  </div>
                </div>

                {request.request_files.length > 0 && (
                  <ul className="flex flex-wrap gap-3">
                    {request.request_files.map((file) => (
                      <li key={file.id}>
                        <a href={`/portal/files/${file.id}`} target="_blank" rel="noopener noreferrer" className="block">
                          {file.mime.startsWith("image/") ? (
                            // Redirects to a short-lived signed URL, so next/image can't optimise it.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={`/portal/files/${file.id}`} alt={file.filename} className="h-24 w-32 rounded-md border object-cover" />
                          ) : (
                            <span className="text-primary underline-offset-4 hover:underline">{file.filename}</span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {status === "open" && (
                  <div className="flex flex-wrap items-center gap-3">
                    <RequestDialog
                      projectId={project.id}
                      clientId={project.client_id}
                      liveUrl={project.live_url}
                      request={request}
                      trigger={<Button size="sm" variant="outline">Edit</Button>}
                    />
                    <CancelRequestButton requestId={request.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
