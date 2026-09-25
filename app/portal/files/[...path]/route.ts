import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/portal/supabase/server";

const PATH = /^[0-9a-f-]{36}\/[0-9a-f-]{36}-[\w.-]{1,120}$/;

// Stable link for an attachment (used in GitHub issues). The path is the object path in
// the request-files bucket; storage RLS only signs it for members of the client whose
// folder it's in. The signed URL it redirects to expires after a minute.
export async function GET(_: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join("/");
  if (!PATH.test(path)) return new NextResponse("Not found", { status: 404 });

  const supabase = await createClient();
  const { data } = await supabase.storage.from("request-files").createSignedUrl(path, 60);
  if (!data) return new NextResponse("Not found", { status: 404 });

  return NextResponse.redirect(data.signedUrl);
}
