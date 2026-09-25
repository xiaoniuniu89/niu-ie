"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { z } from "zod";
import { requireAdmin } from "@/lib/portal/auth";
import { createAdminClient } from "@/lib/portal/supabase/admin";

export type ActionState = { ok: boolean; message: string } | null;

const clientSchema = z.object({ businessName: z.string().trim().min(1) });

export async function createClientAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = clientSchema.safeParse({ businessName: formData.get("businessName") });
  if (!parsed.success) return { ok: false, message: "Business name is required." };

  const { error } = await supabase.from("clients").insert({ business_name: parsed.data.businessName });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/portal/admin");
  return { ok: true, message: `Created ${parsed.data.businessName}.` };
}

const projectSchema = z.object({
  clientId: z.uuid(),
  name: z.string().trim().min(1),
  repo: z.string().trim().regex(/^[\w.-]+\/[\w.-]+$/, "Repo must look like owner/name").or(z.literal("")),
  liveUrl: z.url().or(z.literal("")),
  previewUrl: z.url().or(z.literal("")),
});

export async function createProjectAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { clientId, name, repo, liveUrl, previewUrl } = parsed.data;
  const { error } = await supabase.from("projects").insert({
    client_id: clientId,
    name,
    repo: repo || null,
    live_url: liveUrl || null,
    preview_url: previewUrl || null,
  });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/portal/admin");
  return { ok: true, message: `Linked ${name}.` };
}

const inviteSchema = z.object({ clientId: z.uuid(), email: z.email() });

export async function inviteMemberAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Pick a client and enter a valid email." };

  const email = parsed.data.email.toLowerCase();
  const admin = createAdminClient();

  // Public signups are off, so the account must exist before they can request a login email.
  let userId: string | undefined;
  const created = await admin.auth.admin.createUser({ email, email_confirm: true });
  if (created.data.user) {
    userId = created.data.user.id;
  } else if (created.error?.code === "email_exists") {
    const { data } = await admin.auth.admin.listUsers({ perPage: 1000 });
    userId = data.users.find((u) => u.email?.toLowerCase() === email)?.id;
  }
  if (!userId) return { ok: false, message: created.error?.message ?? "Could not create the user." };

  const { error } = await admin
    .from("members")
    .upsert({ user_id: userId, client_id: parsed.data.clientId }, { onConflict: "user_id,client_id" });
  if (error) return { ok: false, message: error.message };

  const { data: client } = await admin
    .from("clients")
    .select("business_name")
    .eq("id", parsed.data.clientId)
    .single();

  const origin = (await headers()).get("origin") ?? "https://www.niu.ie";
  try {
    await sendInviteEmail(email, client?.business_name ?? "your business", `${origin}/portal/login`);
  } catch {
    revalidatePath("/portal/admin");
    return { ok: false, message: `Access added for ${email}, but the invite email failed. Send them ${origin}/portal/login.` };
  }

  revalidatePath("/portal/admin");
  return { ok: true, message: `Invited ${email}.` };
}

async function sendInviteEmail(to: string, businessName: string, loginUrl: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });

  await transporter.sendMail({
    from: `Niu Web <${process.env.GMAIL_USER}>`,
    to,
    subject: `Your Niu client portal for ${businessName}`,
    text: `You've been given access to the Niu client portal for ${businessName}.\n\nSign in here with this email address: ${loginUrl}\n\nNo password needed. We'll email you a sign-in link each time.`,
    html: `<p>You've been given access to the Niu client portal for <strong>${escapeHtml(businessName)}</strong>.</p>
<p><a href="${loginUrl}">Sign in to the portal</a> with this email address.</p>
<p>No password needed. We'll email you a sign-in link each time.</p>`,
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
