import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/portal/supabase/server";
import { portalIssueStatuses, type RequestStatus } from "@/lib/portal/github";
import type { RequestsResponse } from "@/lib/portal/requests";

// Requests for one project with their GitHub status. Read by the SWR list on the project page.
export async function GET(_: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Signed out" }, { status: 401 });

  // RLS: members see their own client's project and requests only.
  const { data: project } = await supabase
    .from("projects")
    .select(
      "repo, requests (id, type, title, page_url, current, expected, gh_issue_number, created_at, request_files (id, filename, mime))"
    )
    .eq("id", projectId)
    .order("created_at", { referencedTable: "requests", ascending: false })
    .maybeSingle();
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

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

  const body: RequestsResponse = {
    statusError,
    requests: project.requests.map(({ gh_issue_number, ...r }) => ({
      ...r,
      status: (gh_issue_number && statuses.get(gh_issue_number)) || null,
    })),
  };
  return NextResponse.json(body);
}
