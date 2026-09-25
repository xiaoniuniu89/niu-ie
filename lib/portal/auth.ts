import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/portal/supabase/server";

// getClaims verifies the session JWT locally against the project's signing keys, so it
// skips the Auth server round trip getUser makes. Cached per request.
export const getSessionUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  return { supabase, user: claims ? { id: claims.sub, email: claims.email } : null };
});

// For API routes: the session user and whether they're an admin, without redirecting.
export const getSessionAdmin = cache(async () => {
  const { supabase, user } = await getSessionUser();
  if (!user) return { supabase, user, isAdmin: false };

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return { supabase, user, isAdmin: Boolean(admin) };
});

// Cached per request, so the layout and page share one auth check instead of repeating it.
export const requireUser = cache(async () => {
  const { supabase, user, isAdmin } = await getSessionAdmin();
  if (!user) redirect("/portal/login");
  return { supabase, user, isAdmin };
});

export async function requireAdmin() {
  const ctx = await requireUser();
  if (!ctx.isAdmin) redirect("/portal");
  return ctx;
}
