"use client";

import { startTransition, useActionState, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { Paperclip } from "lucide-react";
import {
  cancelRequestAction,
  createRequestAction,
  updateRequestAction,
  type ActionState,
} from "@/app/portal/(app)/requests/actions";
import { createClient } from "@/lib/portal/supabase/client";
import { FILE_ACCEPT, MAX_FILE_BYTES, MAX_FILES, REQUEST_TYPES, requestsKey } from "@/lib/portal/requests";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type RequestValues = {
  id: string;
  type: string;
  title: string;
  page_url: string | null;
  current: string;
  expected: string;
};

type Props = {
  projectId: string;
  clientId: string;
  request?: RequestValues;
  trigger: React.ReactNode;
};

export function RequestDialog({ projectId, clientId, request, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(async (prev, formData) => {
    const result = await (request ? updateRequestAction : createRequestAction)(prev, formData);
    if (result?.ok) {
      setOpen(false);
      mutate(requestsKey(projectId));
      if (!request) router.push(`/portal/projects/${projectId}`);
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
            <DialogTitle>{request ? "Edit request" : "Report an issue"}</DialogTitle>
            <DialogDescription>
              {request
                ? "You can change this until Daniel starts on it."
                : "Tell us what you'd like changed or what isn't working. Plain words are fine."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            {request ? (
              <input type="hidden" name="requestId" value={request.id} />
            ) : (
              <input type="hidden" name="projectId" value={projectId} />
            )}
            <TypeField defaultValue={request?.type ?? "change"} />
            <Field label="Short title" name="title" required maxLength={120} defaultValue={request?.title} placeholder="e.g. Update opening hours" />
            <Field
              label="Which page? (optional)"
              name="pageUrl"
              type="url"
              defaultValue={request?.page_url ?? ""}
              placeholder="https://"
            />
            <Area label="What happens now?" name="current" defaultValue={request?.current} placeholder="e.g. The contact page says we close at 5pm." />
            <Area label="What should happen?" name="expected" defaultValue={request?.expected} placeholder="e.g. It should say 6pm on weekdays." />
            {!request && <FilesField />}

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
                {uploading ? "Uploading…" : pending ? "Sending…" : request ? "Save" : "Send request"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CancelRequestButton({ projectId, requestId }: { projectId: string; requestId: string }) {
  const { mutate } = useSWRConfig();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(async (prev, formData) => {
    const result = await cancelRequestAction(prev, formData);
    if (result?.ok) mutate(requestsKey(projectId));
    return result;
  }, null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!window.confirm("Cancel this request?")) return;
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-3">
      <input type="hidden" name="requestId" value={requestId} />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? "Cancelling…" : "Cancel request"}
      </Button>
      {state && !state.ok && <p className="text-sm text-destructive">{state.message}</p>}
    </form>
  );
}

function TypeField({ defaultValue }: { defaultValue: string }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">What kind of request?</legend>
      <div className="flex flex-wrap gap-2">
        {REQUEST_TYPES.map(([value, label]) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10"
          >
            <input type="radio" name="type" value={value} defaultChecked={value === defaultValue} className="accent-primary" />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
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

function FilesField() {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [names, setNames] = useState<string[]>([]);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Screenshots (optional)</Label>
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
          {names.length ? "Change files" : "Add screenshots"}
        </Button>
        <span className="text-sm text-muted-foreground">
          {names.length ? names.join(", ") : "No files chosen"}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">Up to {MAX_FILES} images or PDFs, 10MB each. Only you and Daniel can see them.</p>
    </div>
  );
}
