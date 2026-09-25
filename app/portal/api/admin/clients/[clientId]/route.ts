import { NextResponse, type NextRequest } from "next/server";
import { getSessionAdmin } from "@/lib/portal/auth";
import { createAdminClient } from "@/lib/portal/supabase/admin";
import type { AdminClientResponse } from "@/lib/portal/admin";

// One client with its projects and people. Read by SWR on the admin client page.
export async function GET(_: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const { supabase, user, isAdmin } = await getSessionAdmin();
  if (!user) return NextResponse.json({ error: "Signed out" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: client, error } = await supabase
    .from("clients")
    .select("id, business_name, status, projects (id, name, repo, live_url, preview_url, status), members (user_id)")
    .eq("id", clientId)
    .order("created_at", { referencedTable: "projects" })
    .maybeSingle();
  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Couldn't load client" }, { status: 500 });
  }
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Member emails live in auth.users, which only the secret key can read.
  const admin = createAdminClient();
  const members = await Promise.all(
    client.members.map(async (m) => {
      const { data } = await admin.auth.admin.getUserById(m.user_id);
      return { userId: m.user_id, email: data.user?.email ?? m.user_id };
    })
  );

  const body: AdminClientResponse = { client: { ...client, members } };
  return NextResponse.json(body);
}
