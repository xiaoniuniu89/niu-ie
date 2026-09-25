import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@/lib/portal/auth";
import { listPortalIssues, parseIssue } from "@/lib/portal/github";
import type { RequestsResponse } from "@/lib/portal/requests";

// Requests for one project, read straight from the portal issues on its repo. Read by the
// SWR lists on the project tabs.
export async function GET(_: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { supabase, user } = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Signed out" }, { status: 401 });

  // RLS: members see their own client's projects only.
  const { data: project } = await supabase.from("projects").select("repo").eq("id", projectId).maybeSingle();
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!project.repo) return NextResponse.json({ requests: [] } satisfies RequestsResponse);

  try {
    const issues = await listPortalIssues(project.repo);
    return NextResponse.json({ requests: issues.map(parseIssue) } satisfies RequestsResponse);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "GitHub unavailable" }, { status: 502 });
  }
}
