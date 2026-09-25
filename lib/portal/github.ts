import "server-only";
import { ATTACHMENTS, FOOTER, REQUEST_FORMS, REQUEST_TYPES, requestKind, type PortalRequest } from "@/lib/portal/requests";

// Fine-grained token with Issues read/write on client repos only. Never the broad GITHUB_TOKEN.
const TOKEN = process.env.GITHUB_ISSUES_TOKEN;
const ASSIGNEE = "xiaoniuniu89";
export const PORTAL_LABEL = "portal";
export const IN_PROGRESS_LABEL = "in-progress";

export type RequestStatus = "open" | "in_progress" | "done" | "cancelled";

export type Issue = {
  number: number;
  title: string;
  body: string | null;
  created_at: string;
  state: "open" | "closed";
  state_reason: string | null;
  labels: { name: string }[];
  html_url: string;
  pull_request?: unknown;
};

async function gh<T>(path: string, init?: RequestInit): Promise<T> {
  if (!TOKEN) throw new Error("GITHUB_ISSUES_TOKEN is not set");
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub ${init?.method ?? "GET"} ${path} failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

export function issueStatus(issue: Pick<Issue, "state" | "state_reason" | "labels">): RequestStatus {
  if (issue.state === "closed") return issue.state_reason === "not_planned" ? "cancelled" : "done";
  return issue.labels.some((l) => l.name === IN_PROGRESS_LABEL) ? "in_progress" : "open";
}

export async function createIssue(repo: string, title: string, body: string) {
  const issue = await gh<Issue>(`/repos/${repo}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, body, labels: [PORTAL_LABEL], assignees: [ASSIGNEE] }),
  });
  return issue.number;
}

export async function getIssue(repo: string, number: number) {
  return gh<Issue>(`/repos/${repo}/issues/${number}`);
}

export async function updateIssue(repo: string, number: number, fields: { title?: string; body?: string }) {
  await gh(`/repos/${repo}/issues/${number}`, { method: "PATCH", body: JSON.stringify(fields) });
}

export async function commentOnIssue(repo: string, number: number, body: string) {
  await gh(`/repos/${repo}/issues/${number}/comments`, { method: "POST", body: JSON.stringify({ body }) });
}

export async function cancelIssue(repo: string, number: number, by: string) {
  await commentOnIssue(repo, number, `Cancelled by ${by} in the Niu portal.`);
  await gh(`/repos/${repo}/issues/${number}`, {
    method: "PATCH",
    body: JSON.stringify({ state: "closed", state_reason: "not_planned" }),
  });
}

const isPortalIssue = (i: Issue) => !i.pull_request && i.labels.some((l) => l.name === PORTAL_LABEL);

// Open portal issues on the repo, newest first; done and cancelled requests drop off.
// The label filter lags a few seconds behind new issues, so the latest open issues are
// also listed unfiltered and merged in.
export async function listPortalIssues(repo: string) {
  const [labelled, latest] = await Promise.all([
    (async () => {
      const all: Issue[] = [];
      for (let page = 1; ; page++) {
        const batch = await gh<Issue[]>(`/repos/${repo}/issues?labels=${PORTAL_LABEL}&state=open&per_page=100&page=${page}`);
        all.push(...batch);
        if (batch.length < 100) return all;
      }
    })(),
    gh<Issue[]>(`/repos/${repo}/issues?state=open&per_page=30`),
  ]);
  const byNumber = new Map([...labelled, ...latest].filter(isPortalIssue).map((i) => [i.number, i]));
  return [...byNumber.values()].sort((a, b) => b.number - a.number);
}

export async function getPortalIssue(repo: string, number: number) {
  const issue = await getIssue(repo, number);
  return isPortalIssue(issue) ? issue : null;
}

// Reads a request back out of its issue. Issues not written by issueBody (made by hand
// with the portal label) show their whole body as the first field.
export function parseIssue(issue: Issue): PortalRequest {
  const body = (issue.body ?? "").replace(/\r\n/g, "\n");
  const typeLabel = body.match(/^\*\*Type:\*\* (.+)$/m)?.[1];
  const type = REQUEST_TYPES.find(([, label]) => label === typeLabel)?.[0] ?? "bug";
  const page = body.match(/^\*\*Page:\*\* (https?:\/\/\S+)$/m)?.[1] ?? null;
  const form = REQUEST_FORMS[requestKind(type)];

  const currentMark = `## ${form.currentHeading}\n\n`;
  const expectedMark = `\n\n## ${form.expectedHeading}\n\n`;
  const currentStart = body.indexOf(currentMark);
  const expectedStart = currentStart < 0 ? -1 : body.indexOf(expectedMark, currentStart);
  // Client text could contain anything, so the tail sections are found from the end.
  const tail = [body.lastIndexOf(`\n\n${ATTACHMENTS}\n\n`), body.lastIndexOf(`\n\n${FOOTER}`)].filter((i) => i > expectedStart);
  const expectedEnd = tail.length ? Math.min(...tail) : body.length;

  const attachmentsStart = body.lastIndexOf(`\n\n${ATTACHMENTS}\n\n`);
  const files =
    attachmentsStart > expectedStart
      ? Array.from(body.slice(attachmentsStart).matchAll(/^- \[([^\]]+)\]\(\S*?\/portal\/files\/(\S+)\)$/gm), ([, filename, path]) => ({ filename, path }))
      : [];

  return {
    number: issue.number,
    type,
    title: issue.title,
    page_url: page,
    current: expectedStart < 0 ? body.trim() : body.slice(currentStart + currentMark.length, expectedStart).trim(),
    expected: expectedStart < 0 ? "" : body.slice(expectedStart + expectedMark.length, expectedEnd).trim(),
    created_at: issue.created_at,
    status: issueStatus(issue),
    files,
  };
}
