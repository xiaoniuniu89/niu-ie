import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/portal/auth";
import type { ProjectsResponse } from "@/lib/portal/projects";

// The signed-in user's clients and their projects. Read by SWR on the overview and project pages.
export async function GET() {
  const { supabase, user } = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Signed out" }, { status: 401 });

  // RLS limits this to the user's own clients; admins see all of them.
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, business_name, projects (id, name, repo, live_url, preview_url, status)")
    .order("business_name");
  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Couldn't load projects" }, { status: 500 });
  }

  const body: ProjectsResponse = { clients };
  return NextResponse.json(body);
}
