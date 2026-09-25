"use client";

import useSWR from "swr";
import { REQUEST_FORMS, REQUEST_STATUS_LABEL, REQUEST_TYPES, isImage, requestKind, requestsKey, type RequestsResponse } from "@/lib/portal/requests";
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

type Props = {
  projectId: string;
  clientId: string;
  // Request types this list shows. Both request tabs share one cached fetch.
  types: readonly string[];
  empty: string;
};

export function RequestList({ projectId, clientId, types, empty }: Props) {
  const { data, error, isLoading } = useSWR<RequestsResponse>(requestsKey(projectId));

  if (isLoading) return <p className="text-muted-foreground">Loading requests…</p>;
  if (error || !data) return <p className="text-sm text-destructive">Couldn&apos;t load your requests. Refresh to try again.</p>;

  const requests = data.requests.filter((r) => types.includes(r.type));

  return (
    <div className="space-y-4">
      {requests.length === 0 && <p className="text-muted-foreground">{empty}</p>}

      {requests.map((request) => {
        const typeLabel = REQUEST_TYPES.find(([value]) => value === request.type)?.[1];
        const kind = requestKind(request.type);
        const form = REQUEST_FORMS[kind];
        return (
          <Card key={request.number}>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-lg">
                {request.title}
                <Badge variant={STATUS_VARIANT[request.status]}>{REQUEST_STATUS_LABEL[request.status]}</Badge>
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
                  <p className="font-medium">{form.currentLabel}</p>
                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{request.current}</p>
                </div>
                <div>
                  <p className="font-medium">{form.expectedLabel}</p>
                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{request.expected}</p>
                </div>
              </div>

              {request.files.length > 0 && (
                <ul className="flex flex-wrap gap-3">
                  {request.files.map((file) => (
                    <li key={file.path}>
                      <a href={`/portal/files/${file.path}`} target="_blank" rel="noopener noreferrer" className="block">
                        {isImage(file.filename) ? (
                          // Redirects to a short-lived signed URL, so next/image can't optimise it.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`/portal/files/${file.path}`} alt={file.filename} className="h-24 w-32 rounded-md border object-cover" />
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
                    kind={kind}
                    request={request}
                    trigger={<Button size="sm" variant="outline">Edit</Button>}
                  />
                  <CancelRequestButton projectId={projectId} issueNumber={request.number} />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
