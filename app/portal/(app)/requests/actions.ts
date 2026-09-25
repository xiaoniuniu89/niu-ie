"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { requireUser } from "@/lib/portal/auth";
import { cancelIssue, commentOnIssue, createIssue, getPortalIssue, parseIssue, updateIssue } from "@/lib/portal/github";
import {
  CHAT_DAILY_LIMIT,
  CHAT_MAX_MESSAGE,
  CHAT_MAX_STRIKES,
  CHAT_MAX_TURNS,
  OFF_TOPIC_REPLY,
  chatTranscript,
  runRequestChat,
} from "@/lib/portal/request-chat";
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
  // "<client_id>/<uuid>-<filename>", linked from the issue as /portal/files/<path>.
  path: z.string().regex(/^[0-9a-f-]{36}\/[0-9a-f-]{36}-[\w.-]{1,120}$/),
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
  const ctx = await requireUser();
  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const { projectId, files, ...fields } = parsed.data;

  const project = await loadProject(ctx.supabase, projectId);
  if (!project.ok) return { ok: false, message: project.message };
  if (files.some((f) => !f.path.startsWith(`${project.client_id}/`))) {
    return { ok: false, message: "One of the attachments isn't allowed." };
  }
  return fileRequest(ctx, project, fields, files);
}

type Ctx = Awaited<ReturnType<typeof requireUser>>;
type Project = { id: string; client_id: string; name: string; repo: string };
type Fields = { type: "change" | "bug"; title: string; pageUrl: string; current: string; expected: string };
type UploadedFile = z.infer<typeof fileSchema>;

// RLS returns the project only if the user belongs to its client.
async function loadProject(supabase: Ctx["supabase"], projectId: string) {
  const { data: project } = await supabase
    .from("projects")
    .select("id, client_id, name, repo")
    .eq("id", projectId)
    .maybeSingle();
  if (!project) return { ok: false, message: "Project not found." } as const;
  if (!project.repo) return { ok: false, message: "This project isn't linked to GitHub yet. Contact us at niu.ie/contact instead." } as const;
  return { ok: true, ...(project as Project) } as const;
}

// Opens the GitHub issue. That issue is the request; nothing is saved in the database.
// Returns the issue number too, so the chat can comment its transcript on it.
async function fileRequest(
  { user }: Ctx,
  project: Project,
  { type, title, pageUrl, current, expected }: Fields,
  files: UploadedFile[]
): Promise<ActionState & { issueNumber?: number }> {
  try {
    const issueNumber = await createIssue(
      project.repo,
      title,
      issueBody({
        type,
        pageUrl,
        current,
        expected,
        reporter: user.email ?? "a client",
        files: files.map(({ path, filename }) => ({ path, filename })),
        origin: await origin(),
      })
    );
    return { ok: true, message: "Request sent.", issueNumber };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "We couldn't send your request. Try again, or contact us at niu.ie/contact." };
  }
}

const chatSchema = z.object({
  projectId: z.uuid(),
  kind: z.enum(["issue", "feature"]),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(2000) }))
    .min(1)
    .max(CHAT_MAX_TURNS * 2)
    .refine((m) => m.at(-1)?.role === "user"),
});

export type ChatState =
  | { status: "reply"; reply: string }
  | { status: "created"; title: string; kind: "issue" | "feature" }
  | { status: "failed"; message: string } // the ticket was ready but filing it failed
  | { status: "ended"; message: string } // too many off-topic messages
  | { status: "error"; message: string };

// The client keeps the conversation and sends it whole each turn; nothing is filed
// until the assistant has enough for the ticket.
export async function requestChatAction(input: z.input<typeof chatSchema>): Promise<ChatState> {
  const ctx = await requireUser();
  const parsed = chatSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "That chat is too long. Please use the form instead." };
  const { projectId, kind, messages } = parsed.data;
  const userTurns = messages.filter((m) => m.role === "user");
  if (userTurns.length > CHAT_MAX_TURNS || userTurns.at(-1)!.content.length > CHAT_MAX_MESSAGE) {
    return { status: "error", message: "That chat is too long. Please use the form instead." };
  }

  const project = await loadProject(ctx.supabase, projectId);
  if (!project.ok) return { status: "error", message: project.message };

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await ctx.supabase
    .from("request_chat_usage")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since);
  if ((count ?? CHAT_DAILY_LIMIT) >= CHAT_DAILY_LIMIT) {
    return { status: "error", message: "You've used the chat a lot today. Please use the form instead." };
  }
  const { error: usageError } = await ctx.supabase.from("request_chat_usage").insert({});
  if (usageError) {
    console.error(usageError);
    return { status: "error", message: "The chat isn't available right now. Please use the form instead." };
  }

  let result;
  try {
    result = await runRequestChat(kind, project.name, messages, userTurns.length >= CHAT_MAX_TURNS);
  } catch (e) {
    console.error(e);
    return { status: "error", message: "The chat isn't available right now. Please try again, or use the form." };
  }
  if (!result.onTopic) {
    const strikes = messages.filter((m) => m.role === "assistant" && m.content === OFF_TOPIC_REPLY).length + 1;
    if (strikes >= CHAT_MAX_STRIKES) {
      return { status: "ended", message: "This chat is only for writing up your request, so it has ended. You can start a new one or use the form." };
    }
    return { status: "reply", reply: result.reply };
  }
  if (!result.ticket) return { status: "reply", reply: result.reply };

  const { ticket } = result;
  const pageUrl = z.url().safeParse(ticket.page_url).success ? ticket.page_url! : "";
  const filed = await fileRequest(
    ctx,
    project,
    { type: ticket.type, title: ticket.title, pageUrl, current: ticket.current, expected: ticket.expected },
    []
  );
  if (!filed?.ok) return { status: "failed", message: filed?.message ?? "We couldn't send your request." };
  if (filed.issueNumber) {
    await commentOnIssue(project.repo, filed.issueNumber, chatTranscript(messages)).catch(console.error);
  }
  return { status: "created", title: ticket.title, kind: ticket.type === "change" ? "feature" : "issue" };
}

const requestRef = { projectId: z.uuid(), issueNumber: z.coerce.number().int().positive() };

// Loads a portal issue on a project the user can see, and only lets it change while it's
// still waiting.
async function loadOpenRequest(projectId: string, issueNumber: number) {
  const ctx = await requireUser();
  const project = await loadProject(ctx.supabase, projectId);
  if (!project.ok) return { ok: false, error: "Request not found." } as const;

  const issue = await getPortalIssue(project.repo, issueNumber);
  if (!issue) return { ok: false, error: "Request not found." } as const;
  const request = parseIssue(issue);
  if (request.status !== "open") return { ok: false, error: "We've already started on this, so you can't change it here." } as const;
  return { ok: true, ...ctx, request, repo: project.repo } as const;
}

const updateSchema = fieldsSchema.extend(requestRef);

export async function updateRequestAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const { projectId, issueNumber, type, title, pageUrl, current, expected } = parsed.data;

  try {
    const loaded = await loadOpenRequest(projectId, issueNumber);
    if (!loaded.ok) return { ok: false, message: loaded.error };
    const { user, request, repo } = loaded;

    await updateIssue(repo, issueNumber, {
      title,
      body: issueBody({
        type,
        pageUrl,
        current,
        expected,
        reporter: user.email ?? "a client",
        files: request.files,
        origin: await origin(),
      }),
    });

    return { ok: true, message: "Saved." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "We couldn't save your changes. Please try again." };
  }
}

export async function cancelRequestAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z.object(requestRef).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Request not found." };

  try {
    const loaded = await loadOpenRequest(parsed.data.projectId, parsed.data.issueNumber);
    if (!loaded.ok) return { ok: false, message: loaded.error };
    await cancelIssue(loaded.repo, loaded.request.number, loaded.user.email ?? "the client");
    return { ok: true, message: "Cancelled." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "We couldn't cancel this. Please try again." };
  }
}
