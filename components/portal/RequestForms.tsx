"use client";

import { startTransition, useActionState, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { Paperclip } from "lucide-react";
import {
  cancelRequestAction,
  createRequestAction,
  updateRequestAction,
  type ActionState,
} from "@/app/portal/(app)/requests/actions";
import { createClient } from "@/lib/portal/supabase/client";
import { FILE_ACCEPT, MAX_FILE_BYTES, MAX_FILES, REQUEST_FORMS, requestsKey, type RequestKind } from "@/lib/portal/requests";
import { projectPath } from "@/lib/portal/projects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type RequestValues = {
  number: number;
  type: string;
  title: string;
  page_url: string | null;
  current: string;
  expected: string;
};

type Props = {
  projectId: string;
  clientId: string;
  kind: RequestKind;
  request?: RequestValues;
  trigger: React.ReactNode;
};

// One dialog, two forms: issues ask what's broken, feature requests ask what they'd like.
export function RequestDialog({ projectId, clientId, kind, request, trigger }: Props) {
  const form = REQUEST_FORMS[kind];
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { mutate } = useSWRConfig();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(async (prev, formData) => {
    const result = await (request ? updateRequestAction : createRequestAction)(prev, formData);
    if (result?.ok) {
      setOpen(false);
      mutate(requestsKey(projectId));
      // From the overview, open the project on the tab that lists the new request.
      if (!request && pathname !== projectPath(projectId)) {
        router.push(`${projectPath(projectId)}?tab=${kind === "feature" ? "features" : "issues"}`);
      }
    }
    return result;
  }, null);

  // Files go straight from the browser to the private bucket (server actions on Vercel
  // cap request bodies at 4.5MB). Storage RLS only accepts paths under the client's folder.
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploadError(null);
    const formData = new FormData(e.currentTarget);
    const files = formData.getAll("attachments").filter((f): f is File => f instanceof File && f.size > 0);
    formData.delete("attachments");

    if (files.length > MAX_FILES) return setUploadError(`Attach up to ${MAX_FILES} files.`);
    const tooBig = files.find((f) => f.size > MAX_FILE_BYTES);
    if (tooBig) return setUploadError(`${tooBig.name} is over 10MB.`);

    setUploading(true);
    const supabase = createClient();
    const uploaded = [];
    for (const file of files) {
      const filename = file.name.replace(/[^\w.-]+/g, "-").slice(-120);
      const path = `${clientId}/${crypto.randomUUID()}-${filename}`;
      const { error } = await supabase.storage.from("request-files").upload(path, file, { contentType: file.type });
      if (error) {
        setUploading(false);
        return setUploadError(`Couldn't upload ${file.name}. Check it's an image or PDF and try again.`);
      }
      uploaded.push({ path, filename, mime: file.type, size: file.size });
    }
    setUploading(false);

    formData.set("files", JSON.stringify(uploaded));
    startTransition(() => formAction(formData));
  }

  const busy = uploading || pending;
  const message = uploadError ?? (state && !state.ok ? state.message : null);

  return (
    <Dialog open={open} onOpenChange={(next) => !busy && setOpen(next)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {/* Only the X, Cancel or Escape close it, so a stray click can't lose what they typed. */}
      <DialogContent className="max-w-lg p-0" onInteractOutside={(e) => e.preventDefault()}>
        <div className="overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>{request ? "Edit request" : form.title}</DialogTitle>
            <DialogDescription>{request ? "You can change this until we start on it." : form.description}</DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <input type="hidden" name="projectId" value={projectId} />
            {request && <input type="hidden" name="issueNumber" value={request.number} />}
            <input type="hidden" name="type" value={request?.type ?? form.type} />
            <Field label="Short title" name="title" required maxLength={120} defaultValue={request?.title} placeholder={form.titlePlaceholder} />
            <Field
              label={form.pageLabel}
              name="pageUrl"
              type="url"
              defaultValue={request?.page_url ?? ""}
              placeholder="https://"
            />
            <Area label={form.currentLabel} name="current" defaultValue={request?.current} placeholder={form.currentPlaceholder} />
            <Area label={form.expectedLabel} name="expected" defaultValue={request?.expected} placeholder={form.expectedPlaceholder} />
            {!request && <FilesField label={form.filesLabel} addLabel={form.addFiles} />}

            {message && (
              <p className="text-sm text-destructive" role="status">
                {message}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-3 pt-1">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={busy}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={busy}>
                {uploading ? "Uploading…" : pending ? "Sending…" : request ? "Save" : form.submit}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CancelRequestButton({ projectId, issueNumber }: { projectId: string; issueNumber: number }) {
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(async (prev, formData) => {
    const result = await cancelRequestAction(prev, formData);
    if (result?.ok) {
      setOpen(false);
      mutate(requestsKey(projectId));
    }
    return result;
  }, null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" disabled={pending}>
          {pending ? "Cancelling…" : "Cancel request"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cancel this request?</DialogTitle>
          <DialogDescription>It will be removed from your list and we won&apos;t work on it.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="issueNumber" value={issueNumber} />
          {state && !state.ok && (
            <p className="text-sm text-destructive" role="alert">
              {state.message}
            </p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Keep it
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? "Cancelling…" : "Cancel request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, name, ...props }: { label: string; name: string } & React.ComponentProps<"input">) {
  const id = useId();
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} {...props} />
    </div>
  );
}

function Area({ label, name, ...props }: { label: string; name: string } & React.ComponentProps<"textarea">) {
  const id = useId();
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} name={name} required maxLength={5000} rows={3} {...props} />
    </div>
  );
}

function FilesField({ label, addLabel }: { label: string; addLabel: string }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [names, setNames] = useState<string[]>([]);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <input
        ref={input}
        id={id}
        name="attachments"
        type="file"
        multiple
        accept={FILE_ACCEPT}
        className="sr-only"
        onChange={(e) => setNames(Array.from(e.target.files ?? [], (f) => f.name))}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={() => input.current?.click()}>
          <Paperclip className="h-4 w-4" />
          {names.length ? "Change files" : addLabel}
        </Button>
        <span className="text-sm text-muted-foreground">
          {names.length ? names.join(", ") : "No files chosen"}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">Up to {MAX_FILES} images or PDFs, 10MB each. Only you and Niu can see them.</p>
    </div>
  );
}
