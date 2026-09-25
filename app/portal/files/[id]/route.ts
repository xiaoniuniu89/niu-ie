import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/portal/supabase/server";

// Stable link for an attachment (used in GitHub issues). RLS decides who can see the
// row and the object; the signed URL it redirects to expires after a minute.
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: file } = await supabase.from("request_files").select("path").eq("id", id).maybeSingle();
  if (!file) return new NextResponse("Not found", { status: 404 });

  const { data } = await supabase.storage.from("request-files").createSignedUrl(file.path, 60);
  if (!data) return new NextResponse("Not found", { status: 404 });

  return NextResponse.redirect(data.signedUrl);
}
