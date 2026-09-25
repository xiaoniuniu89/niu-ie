import "server-only";
import { createClient } from "@supabase/supabase-js";

// Secret key bypasses RLS. Only call after checking the caller is an admin.
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
