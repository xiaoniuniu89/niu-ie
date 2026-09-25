"use client";

import useSWR from "swr";
import { REQUEST_STATUS_LABEL, REQUEST_TYPES, fetchRequests, requestsKey } from "@/lib/portal/requests";
import type { RequestStatus } from "@/lib/portal/github";
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

export function RequestList({ projectId, clientId }: { projectId: string; clientId: string }) {
  const { data, error, isLoading } = useSWR(requestsKey(projectId), fetchRequests);

  if (isLoading) return <p className="text-muted-foreground">Loading requests…</p>;
  if (error || !data) return <p className="text-sm text-destructive">Couldn&apos;t load your requests. Refresh to try again.</p>;

  return (
    <div className="space-y-4">
      {data.statusError && <p className="text-sm text-destructive">Couldn&apos;t check the latest status. Try again shortly.</p>}
      {data.requests.length === 0 && (
        <p className="text-muted-foreground">No requests yet. Use &ldquo;Report an issue&rdquo; to send the first one.</p>
      )}

      {data.requests.map((request) => {
        const typeLabel = REQUEST_TYPES.find(([value]) => value === request.type)?.[1];
        return (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-lg">
                {request.title}
                {request.status && <Badge variant={STATUS_VARIANT[request.status]}>{REQUEST_STATUS_LABEL[request.status]}</Badge>}
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

              {request.status === "open" && (
                <div className="flex flex-wrap items-center gap-3">
                  <RequestDialog
                    projectId={projectId}
                    clientId={clientId}
                    request={request}
                    trigger={<Button size="sm" variant="outline">Edit</Button>}
                  />
                  <CancelRequestButton projectId={projectId} requestId={request.id} />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
