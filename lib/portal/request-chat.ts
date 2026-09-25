import "server-only";
import { z } from "zod";
import type { RequestKind } from "@/lib/portal/requests";

// Any OpenAI-compatible chat API. Defaults to OpenAI; for DeepSeek set
// AI_BASE_URL=https://api.deepseek.com and AI_MODEL=deepseek-chat.
const API_KEY = process.env.AI_API_KEY;
const BASE_URL = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
const MODEL = process.env.AI_MODEL ?? "gpt-4o-mini";

// Caps that keep a chat cheap and stop it being used as a free chatbot.
export const CHAT_MAX_MESSAGE = 1000;
export const CHAT_MAX_TURNS = 6; // client messages per chat; the last one must end in a ticket
export const CHAT_DAILY_LIMIT = 30; // assistant replies per user per 24 hours
const MAX_REPLY_TOKENS = 600;

export type ChatMessage = { role: "user" | "assistant"; content: string };

export const ticketSchema = z.object({
  title: z.string().trim().min(3).max(120),
  page_url: z.string().trim().max(500).nullish(),
  current: z.string().trim().min(1).max(5000),
  expected: z.string().trim().min(1).max(5000),
});

export type Ticket = z.infer<typeof ticketSchema>;

const replySchema = z.object({
  reply: z.string().max(2000).default(""),
  ticket: ticketSchema.nullish(),
});

const BRIEF = {
  issue: `The client is reporting something on their website that isn't working. Before filing, you need:
- what they did and what happened (the exact page or link if they know it, the button or form involved)
- what they expected to happen instead
- whether it happens every time, and on phone, computer or both, when that matters
Ticket fields: "current" = what happens now, including steps to see it; "expected" = what should happen.`,
  feature: `The client is asking for something to be added or changed on their website. Before filing, you need:
- what exactly they want added or changed, and where on the site
- enough detail to build it without guessing (content, how many items, who uses it, anything it should link to)
- why they want it, if that isn't already obvious
Ticket fields: "current" = what they'd like, in full; "expected" = why it would help.`,
};

function systemPrompt(kind: RequestKind, projectName: string, lastTurn: boolean) {
  return `You help a small business client write a clear ${kind === "issue" ? "issue report" : "feature request"} for Daniel, the developer who built their website "${projectName}". Daniel reads the ticket later; you can't fix or build anything yourself.

${BRIEF[kind]}

How to talk:
- Plain, friendly words. Irish/UK spelling. No jargon. Keep each reply to one or two short questions.
- Only ask what is missing or unclear. Don't ask for things they already said. Never ask for passwords or payment details.
- Never promise when it will be done, what it will cost, or that it can be done at all.
- If they ask for anything unrelated to this ${kind === "issue" ? "issue" : "request"}, say you can only help write it up.
- Screenshots can't be attached here. If one would really help, say they can add it by editing the request later or emailing Daniel.

When you have enough to act on, or they say to just send it, stop asking and file the ticket. Write the ticket in their voice, clearly and completely, keeping every detail they gave. Don't invent details.${
    lastTurn ? "\n\nThis is the last message you can send. File the ticket now with what you have." : ""
  }

Always answer with a JSON object only:
- still asking: {"reply": "<your message>", "ticket": null}
- ready: {"reply": "", "ticket": {"title": "<short title, under 80 characters>", "page_url": "<full https link or null>", "current": "...", "expected": "..."}}`;
}

export type ChatResult = { reply: string; ticket: Ticket | null };

export async function runRequestChat(
  kind: RequestKind,
  projectName: string,
  messages: ChatMessage[],
  lastTurn: boolean
): Promise<ChatResult> {
  if (!API_KEY) throw new Error("AI_API_KEY is not set");
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: systemPrompt(kind, projectName, lastTurn) }, ...messages],
      response_format: { type: "json_object" },
      max_tokens: MAX_REPLY_TOKENS,
      temperature: 0.3,
    }),
    signal: AbortSignal.timeout(30_000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`AI chat failed: ${res.status} ${await res.text()}`);

  const data = await res.json();
  const parsed = replySchema.parse(JSON.parse(data.choices?.[0]?.message?.content ?? "{}"));
  if (!parsed.ticket && !parsed.reply) throw new Error("AI chat returned neither a reply nor a ticket");
  return { reply: parsed.reply, ticket: parsed.ticket ?? null };
}

// Posted as a comment on the new issue so Daniel can see how the ticket was worked out.
export function chatTranscript(messages: ChatMessage[]) {
  const lines = messages.map((m) => `**${m.role === "user" ? "Client" : "Assistant"}:** ${m.content}`);
  return `<details>\n<summary>Chat the client had with the portal assistant</summary>\n\n${lines.join("\n\n")}\n\n</details>`;
}
