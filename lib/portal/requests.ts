import type { RequestStatus } from "@/lib/portal/github";

export const REQUEST_TYPES = [
  ["change", "Change something"],
  ["bug", "Something is broken"],
  ["question", "Ask a question"],
] as const;

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  open: "Received",
  in_progress: "In progress",
  done: "Done",
  cancelled: "Cancelled",
};

export type PortalRequest = {
  id: string;
  type: string;
  title: string;
  page_url: string | null;
  current: string;
  expected: string;
  created_at: string;
  status: RequestStatus | null;
  request_files: { id: string; filename: string; mime: string }[];
};

export type RequestsResponse = { requests: PortalRequest[]; statusError: boolean };

// SWR key for a project's request list. Mutate it after creating, editing or cancelling.
export const requestsKey = (projectId: string) => `/portal/api/projects/${projectId}/requests`;

export async function fetchRequests(url: string): Promise<RequestsResponse> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} failed: ${res.status}`);
  return res.json();
}

export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const FILE_ACCEPT = "image/png,image/jpeg,image/webp,image/gif,application/pdf";

type IssueFields = {
  type: string;
  pageUrl: string | null;
  current: string;
  expected: string;
  reporter: string;
  files: { id: string; filename: string }[];
  origin: string;
};

export function issueBody(r: IssueFields) {
  const typeLabel = REQUEST_TYPES.find(([value]) => value === r.type)?.[1] ?? r.type;
  const sections = [
    `**Type:** ${typeLabel}`,
    `**Page:** ${r.pageUrl || "Not given"}`,
    `## Current behaviour\n\n${r.current}`,
    `## Expected behaviour\n\n${r.expected}`,
  ];
  if (r.files.length) {
    // Portal links check the viewer's session, then redirect to a short-lived signed URL.
    const links = r.files.map((f) => `- [${f.filename}](${r.origin}/portal/files/${f.id})`).join("\n");
    sections.push(`## Attachments\n\n${links}`);
  }
  sections.push(`---\nReported by ${r.reporter} via the Niu portal.`);
  return sections.join("\n\n");
}
