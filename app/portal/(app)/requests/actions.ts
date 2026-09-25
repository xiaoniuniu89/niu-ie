"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { requireUser } from "@/lib/portal/auth";
import { cancelIssue, createIssue, getIssue, issueStatus, updateIssue } from "@/lib/portal/github";
import { FILE_ACCEPT, MAX_FILE_BYTES, MAX_FILES, issueBody } from "@/lib/portal/requests";

export type ActionState = { ok: boolean; message: string } | null;

const fieldsSchema = z.object({
  type: z.enum(["change", "bug", "question"]),
  title: z.string().trim().min(3, "Give it a short title.").max(120, "Keep the title under 120 characters."),
  pageUrl: z.url("Page link must start with https://").or(z.literal("")),
  current: z.string().trim().min(1, "Fill in both boxes.").max(5000),
  expected: z.string().trim().min(1, "Fill in both boxes.").max(5000),
});

const fileSchema = z.object({
  path: z.string(),
  filename: z.string().regex(/^[\w.-]{1,120}$/),
  mime: z.string().refine((m) => FILE_ACCEPT.split(",").includes(m)),
  size: z.number().int().positive().max(MAX_FILE_BYTES),
});

const createSchema = fieldsSchema.extend({
  // New requests come from the issue or feature form; "question" only survives on older rows.
  type: z.enum(["change", "bug"]),
  projectId: z.uuid(),
  files: z.string().transform((s, ctx) => {
    const parsed = z.array(fileSchema).max(MAX_FILES).safeParse(JSON.parse(s || "[]"));
    if (!parsed.success) {
      ctx.addIssue({ code: "custom", message: "One of the attachments isn't allowed." });
      return z.NEVER;
    }
    return parsed.data;
  }),
});

async function origin() {
  return (await headers()).get("origin") ?? "https://www.niu.ie";
}

export async function createRequestAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, user } = await requireUser();
  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const { projectId, type, title, pageUrl, current, expected, files } = parsed.data;

  // RLS returns the project only if the user belongs to its client.
  const { data: project } = await supabase
    .from("projects")
    .select("id, client_id, repo")
    .eq("id", projectId)
    .maybeSingle();
  if (!project) return { ok: false, message: "Project not found." };
  if (!project.repo) return { ok: false, message: "This project isn't linked to GitHub yet. Please email Daniel instead." };
  if (files.some((f) => !f.path.startsWith(`${project.client_id}/`))) {
    return { ok: false, message: "One of the attachments isn't allowed." };
  }

  // Ids are made up front so the issue body can link each file.
  const requestId = crypto.randomUUID();
  const fileRows = files.map((f) => ({ id: crypto.randomUUID(), request_id: requestId, client_id: project.client_id, ...f }));

  let issueNumber: number;
  try {
    issueNumber = await createIssue(
      project.repo,
      title,
      issueBody({ type, pageUrl, current, expected, reporter: user.email ?? "a client", files: fileRows, origin: await origin() })
    );
  } catch (e) {
    console.error(e);
    return { ok: false, message: "We couldn't send your request. Please try again, or email Daniel." };
  }

  const { error } = await supabase.from("requests").insert({
    id: requestId,
    client_id: project.client_id,
    project_id: project.id,
    created_by: user.id,
    type,
    title,
    page_url: pageUrl || null,
    current,
    expected,
    gh_issue_number: issueNumber,
  });
  if (!error && fileRows.length) {
    const { error: filesError } = await supabase.from("request_files").insert(fileRows);
    if (filesError) console.error(filesError);
  }
  if (error) {
    console.error(error);
    return { ok: false, message: "Your request reached Daniel, but we couldn't save it here." };
  }

  return { ok: true, message: "Request sent." };
}

// Loads a request the user can see, and only lets it change while it's still waiting.
async function loadOpenRequest(requestId: string) {
  const ctx = await requireUser();
  const { data: request } = await ctx.supabase
    .from("requests")
    .select("id, gh_issue_number, projects (repo), request_files (id, filename)")
    .eq("id", requestId)
    .maybeSingle();
  // No generated DB types, so the many-to-one join is typed as an array; it is one row.
  const repo = (request?.projects as unknown as { repo: string | null } | null)?.repo;
  if (!request || !repo || !request.gh_issue_number) return { ok: false, error: "Request not found." } as const;

  const issue = await getIssue(repo, request.gh_issue_number);
  if (issueStatus(issue) !== "open") return { ok: false, error: "Daniel has already started on this, so it can't be changed here." } as const;
  return { ok: true, ...ctx, request, repo, issueNumber: request.gh_issue_number as number } as const;
}

const updateSchema = fieldsSchema.extend({ requestId: z.uuid() });

export async function updateRequestAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const { requestId, type, title, pageUrl, current, expected } = parsed.data;

  try {
    const loaded = await loadOpenRequest(requestId);
    if (!loaded.ok) return { ok: false, message: loaded.error };
    const { supabase, user, request, repo, issueNumber } = loaded;

    await updateIssue(repo, issueNumber, {
      title,
      body: issueBody({
        type,
        pageUrl,
        current,
        expected,
        reporter: user.email ?? "a client",
        files: request.request_files,
        origin: await origin(),
      }),
    });
    const { error } = await supabase
      .from("requests")
      .update({ type, title, page_url: pageUrl || null, current, expected, updated_at: new Date().toISOString() })
      .eq("id", requestId);
    if (error) throw error;

    return { ok: true, message: "Saved." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "We couldn't save your changes. Please try again." };
  }
}

export async function cancelRequestAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z.object({ requestId: z.uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Request not found." };

  try {
    const loaded = await loadOpenRequest(parsed.data.requestId);
    if (!loaded.ok) return { ok: false, message: loaded.error };
    await cancelIssue(loaded.repo, loaded.issueNumber, loaded.user.email ?? "the client");
    return { ok: true, message: "Cancelled." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "We couldn't cancel this. Please try again." };
  }
}
