"use client";

import { useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { CheckCircle2, MessageCircle, SendHorizontal, X, XCircle } from "lucide-react";
import { requestChatAction } from "@/app/portal/(app)/requests/actions";
import { requestsKey, type RequestKind } from "@/lib/portal/requests";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Message = { role: "user" | "assistant"; content: string };
type Pill = { ok: boolean; text: string } | null;

// Mirrors CHAT_MAX_MESSAGE in lib/portal/request-chat.ts (server-only, so not importable here).
const MAX_MESSAGE = 1000;

const COPY = {
  issue: {
    trigger: "Describe it in a chat",
    title: "Describe the issue",
    greeting: "Tell me what isn't working, in your own words. I'll ask anything Daniel would need to know, then send it to him.",
    placeholder: "e.g. The contact form on the home page doesn't send",
  },
  feature: {
    trigger: "Describe it in a chat",
    title: "Describe your idea",
    greeting: "Tell me what you'd like added or changed. I'll ask anything Daniel would need to know, then send it to him.",
    placeholder: "e.g. I'd like a gallery page with photos of our work",
  },
};

// An optional alternative to the form: the assistant asks follow-up questions until the
// request is clear, files it, closes, and leaves a pill saying whether it worked.
export function RequestChat({ projectId, kind }: { projectId: string; kind: RequestKind }) {
  const copy = COPY[kind];
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState<string | null>(null);
  const [pill, setPill] = useState<Pill>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => bottom.current?.scrollIntoView({ block: "end" }), [messages, pending, error]);

  useEffect(() => {
    if (!pill) return;
    const timer = setTimeout(() => setPill(null), 10_000);
    return () => clearTimeout(timer);
  }, [pill]);

  async function send(history: Message[]) {
    setPending(true);
    setError(null);
    const result = await requestChatAction({ projectId, kind, messages: history }).catch(() => ({
      status: "error" as const,
      message: "We couldn't reach the chat. Please try again.",
    }));
    setPending(false);

    if (result.status === "reply") {
      setMessages([...history, { role: "assistant", content: result.reply }]);
    } else if (result.status === "created") {
      setMessages([]);
      setOpen(false);
      setPill({ ok: true, text: `Sent to Daniel: “${result.title}”` });
      mutate(requestsKey(projectId));
    } else if (result.status === "failed") {
      // Keep the chat, so reopening it offers Try again.
      setError(result.message);
      setOpen(false);
      setPill({ ok: false, text: `Not sent. ${result.message}` });
    } else if (result.status === "ended") {
      setEnded(result.message);
    } else {
      setError(result.message);
    }
  }

  function restart() {
    setMessages([]);
    setError(null);
    setEnded(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content || pending) return;
    const history = [...messages, { role: "user" as const, content }];
    setMessages(history);
    setDraft("");
    send(history);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  function close() {
    if (pending) return;
    setOpen(false);
  }

  const lastIsUser = messages.at(-1)?.role === "user";

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setPill(null)}>
            <MessageCircle className="h-4 w-4" />
            {copy.trigger}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg p-0" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="border-b px-6 pb-4 pt-6">
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>An assistant helps you write it up. Daniel reads every request himself.</DialogDescription>
          </DialogHeader>

          <div className="min-h-48 flex-1 space-y-3 overflow-y-auto px-6 py-4" aria-live="polite">
            <Bubble role="assistant">{copy.greeting}</Bubble>
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role}>
                {m.content}
              </Bubble>
            ))}
            {pending && (
              <p className="text-sm text-muted-foreground" role="status">
                Thinking…
              </p>
            )}
            {ended && (
              <div className="space-y-2" role="alert">
                <p className="text-sm text-muted-foreground">{ended}</p>
                <Button type="button" size="sm" variant="outline" onClick={restart}>
                  Start again
                </Button>
              </div>
            )}
            {error && (
              <div className="space-y-2" role="alert">
                <p className="text-sm text-destructive">{error}</p>
                {lastIsUser && (
                  <Button type="button" size="sm" variant="outline" onClick={() => send(messages)}>
                    Try again
                  </Button>
                )}
              </div>
            )}
            <div ref={bottom} />
          </div>

          <form onSubmit={onSubmit} className="flex items-end gap-2 border-t px-6 py-4">
            <Textarea
              aria-label="Your message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              maxLength={MAX_MESSAGE}
              rows={2}
              placeholder={messages.length ? "Type your answer" : copy.placeholder}
              disabled={pending || Boolean(ended)}
              className="resize-none"
            />
            <Button type="submit" size="icon" disabled={pending || Boolean(ended) || !draft.trim()} aria-label="Send">
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {pill && (
        <div
          role="status"
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
            pill.ok ? "border-green-600/30 bg-green-600/10 text-green-800 dark:text-green-300" : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {pill.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
          <span className="line-clamp-1">{pill.text}</span>
          <button type="button" onClick={() => setPill(null)} aria-label="Dismiss" className="opacity-70 hover:opacity-100">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </>
  );
}

function Bubble({ role, children }: { role: Message["role"]; children: React.ReactNode }) {
  return (
    <p
      className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${
        role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"
      }`}
    >
      {children}
    </p>
  );
}
