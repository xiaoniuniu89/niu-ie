import { NextResponse } from "next/server";
import { getSessionAdmin } from "@/lib/portal/auth";
import type { AdminClientsResponse } from "@/lib/portal/admin";

// Every client with project and member counts. Read by SWR on the admin page.
export async function GET() {
  const { supabase, user, isAdmin } = await getSessionAdmin();
  if (!user) return NextResponse.json({ error: "Signed out" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, business_name, status, projects (id), members (user_id)")
    .order("business_name");
  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Couldn't load clients" }, { status: 500 });
  }

  return NextResponse.json({ clients } satisfies AdminClientsResponse);
}
