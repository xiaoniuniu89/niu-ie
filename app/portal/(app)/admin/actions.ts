"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";
import { z } from "zod";
import { requireAdmin } from "@/lib/portal/auth";
import { createAdminClient } from "@/lib/portal/supabase/admin";

export type ActionState = { ok: boolean; message: string } | null;

const CLIENT_STATUSES = ["active", "paused", "archived"] as const;
const PROJECT_STATUSES = ["planning", "in_progress", "live", "maintenance"] as const;

const clientPath = (id: string) => `/portal/admin/${id}`;

const clientSchema = z.object({ businessName: z.string().trim().min(1) });

export async function createClientAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = clientSchema.safeParse({ businessName: formData.get("businessName") });
  if (!parsed.success) return { ok: false, message: "Business name is required." };

  const { data, error } = await supabase
    .from("clients")
    .insert({ business_name: parsed.data.businessName })
    .select("id")
    .single();
  if (error) return { ok: false, message: error.message };

  revalidatePath("/portal/admin");
  redirect(clientPath(data.id));
}

const updateClientSchema = z.object({
  clientId: z.uuid(),
  businessName: z.string().trim().min(1, "Business name is required."),
  status: z.enum(CLIENT_STATUSES),
});

export async function updateClientAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = updateClientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { clientId, businessName, status } = parsed.data;
  const { error } = await supabase
    .from("clients")
    .update({ business_name: businessName, status })
    .eq("id", clientId);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/portal/admin", "layout");
  return { ok: true, message: "Saved." };
}

const projectFields = {
  name: z.string().trim().min(1, "Project name is required."),
  repo: z.string().trim().regex(/^[\w.-]+\/[\w.-]+$/, "Repo must look like owner/name").or(z.literal("")),
  liveUrl: z.url("Live URL must start with https://").or(z.literal("")),
  previewUrl: z.url("Preview URL must start with https://").or(z.literal("")),
  status: z.enum(PROJECT_STATUSES),
};

function projectRow(p: { name: string; repo: string; liveUrl: string; previewUrl: string; status: string }) {
  return {
    name: p.name,
    repo: p.repo || null,
    live_url: p.liveUrl || null,
    preview_url: p.previewUrl || null,
    status: p.status,
  };
}

const createProjectSchema = z.object({ clientId: z.uuid(), ...projectFields });

export async function createProjectAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = createProjectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("projects")
    .insert({ client_id: parsed.data.clientId, ...projectRow(parsed.data) });
  if (error) return { ok: false, message: error.message };

  revalidatePath(clientPath(parsed.data.clientId));
  return { ok: true, message: `Added ${parsed.data.name}.` };
}

const updateProjectSchema = z.object({ clientId: z.uuid(), projectId: z.uuid(), ...projectFields });

export async function updateProjectAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = updateProjectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("projects")
    .update(projectRow(parsed.data))
    .eq("id", parsed.data.projectId);
  if (error) return { ok: false, message: error.message };

  revalidatePath(clientPath(parsed.data.clientId));
  return { ok: true, message: "Saved." };
}

const deleteProjectSchema = z.object({ clientId: z.uuid(), projectId: z.uuid() });

export async function deleteProjectAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = deleteProjectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Missing project." };

  const { error } = await supabase.from("projects").delete().eq("id", parsed.data.projectId);
  if (error) return { ok: false, message: error.message };

  revalidatePath(clientPath(parsed.data.clientId));
  return { ok: true, message: "Removed." };
}

const inviteSchema = z.object({ clientId: z.uuid(), email: z.email("Enter a valid email.") });

export async function inviteMemberAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

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

  revalidatePath(clientPath(parsed.data.clientId));
  const origin = (await headers()).get("origin") ?? "https://www.niu.ie";
  try {
    await sendInviteEmail(email, client?.business_name ?? "your business", `${origin}/portal/login`);
  } catch {
    return { ok: false, message: `Access added for ${email}, but the invite email failed. Send them ${origin}/portal/login.` };
  }

  return { ok: true, message: `Invited ${email}.` };
}

const removeMemberSchema = z.object({ clientId: z.uuid(), userId: z.uuid() });

// Removes access to this client only. The login account stays so other memberships keep working.
export async function removeMemberAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = removeMemberSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Missing person." };

  const { error } = await supabase
    .from("members")
    .delete()
    .eq("client_id", parsed.data.clientId)
    .eq("user_id", parsed.data.userId);
  if (error) return { ok: false, message: error.message };

  revalidatePath(clientPath(parsed.data.clientId));
  return { ok: true, message: "Removed." };
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
