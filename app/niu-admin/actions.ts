"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/portal/supabase/server";

export type SignInState = { error: string } | null;

const schema = z.object({ email: z.email(), password: z.string().min(1) });

export async function adminSignInAction(_: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Wrong email or password." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: error.status === 429 ? "Too many attempts. Wait a minute and try again." : "Wrong email or password." };
  }

  // Password sign-in is for admins only. Anyone else gets the same error as a wrong password.
  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "Wrong email or password." };
  }

  redirect("/portal/admin");
}
