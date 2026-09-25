import "server-only";

// Fine-grained token with Issues read/write on client repos only. Never the broad GITHUB_TOKEN.
const TOKEN = process.env.GITHUB_ISSUES_TOKEN;
const ASSIGNEE = "xiaoniuniu89";
export const PORTAL_LABEL = "portal";
export const IN_PROGRESS_LABEL = "in-progress";

export type RequestStatus = "open" | "in_progress" | "done" | "cancelled";

type Issue = {
  number: number;
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

// Status for each issue number, keyed by number. One list call covers most; issues it
// misses (just created, since the label filter lags a few seconds, or older than the
// latest 100) are fetched one by one.
export async function portalIssueStatuses(repo: string, numbers: number[]) {
  const issues = await gh<Issue[]>(`/repos/${repo}/issues?labels=${PORTAL_LABEL}&state=all&per_page=100`);
  const statuses = new Map(issues.filter((i) => !i.pull_request).map((i) => [i.number, issueStatus(i)]));
  const missing = numbers.filter((n) => !statuses.has(n));
  const fetched = await Promise.all(missing.map((n) => getIssue(repo, n)));
  fetched.forEach((i) => statuses.set(i.number, issueStatus(i)));
  return statuses;
}
