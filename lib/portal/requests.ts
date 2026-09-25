import type { RequestStatus } from "@/lib/portal/github";

export const REQUEST_TYPES = [
  ["change", "Feature request"],
  ["bug", "Something is broken"],
  ["question", "Question"],
] as const;

// Issues and feature requests use separate forms. Both save to the same columns: for a
// feature, `current` holds what they'd like and `expected` holds why it would help.
// "question" is no longer offered but older rows still list under issues.
export type RequestKind = "issue" | "feature";

export const requestKind = (type: string): RequestKind => (type === "change" ? "feature" : "issue");

export const REQUEST_FORMS = {
  issue: {
    type: "bug",
    title: "Report an issue",
    description: "Tell us what isn't working. Plain words are fine.",
    titlePlaceholder: "e.g. Contact form doesn't send",
    pageLabel: "Which page? (optional)",
    currentLabel: "What happens now?",
    currentPlaceholder: "e.g. I press Send and nothing happens.",
    expectedLabel: "What should happen?",
    expectedPlaceholder: "e.g. It should say the message was sent.",
    filesLabel: "Screenshots (optional)",
    addFiles: "Add screenshots",
    submit: "Send report",
    currentHeading: "Current behaviour",
    expectedHeading: "Expected behaviour",
  },
  feature: {
    type: "change",
    title: "Request a feature",
    description: "Tell us what you'd like added or changed on your site.",
    titlePlaceholder: "e.g. Add a gallery page",
    pageLabel: "Where on the site? (optional)",
    currentLabel: "What would you like?",
    currentPlaceholder: "e.g. A page with photos of our recent work.",
    expectedLabel: "Why would it help?",
    expectedPlaceholder: "e.g. Customers keep asking to see examples.",
    filesLabel: "Examples or mockups (optional)",
    addFiles: "Add files",
    submit: "Send request",
    currentHeading: "Request",
    expectedHeading: "Why it would help",
  },
} as const;

// Which request types each project tab lists.
export const ISSUE_TYPES = ["bug", "question"] as const;
export const FEATURE_TYPES = ["change"] as const;

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
  const form = REQUEST_FORMS[requestKind(r.type)];
  const sections = [
    `**Type:** ${typeLabel}`,
    `**Page:** ${r.pageUrl || "Not given"}`,
    `## ${form.currentHeading}\n\n${r.current}`,
    `## ${form.expectedHeading}\n\n${r.expected}`,
  ];
  if (r.files.length) {
    // Portal links check the viewer's session, then redirect to a short-lived signed URL.
    const links = r.files.map((f) => `- [${f.filename}](${r.origin}/portal/files/${f.id})`).join("\n");
    sections.push(`## Attachments\n\n${links}`);
  }
  sections.push(`---\nReported by ${r.reporter} via the Niu portal.`);
  return sections.join("\n\n");
}
