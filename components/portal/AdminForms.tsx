"use client";

import { startTransition, useActionState, useEffect, useId, useRef } from "react";
import {
  createClientAction,
  createProjectAction,
  deleteProjectAction,
  inviteMemberAction,
  removeMemberAction,
  setPasswordAction,
  updateClientAction,
  updateProjectAction,
  type ActionState,
} from "@/app/portal/(app)/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

export type ProjectValues = {
  id: string;
  name: string;
  repo: string | null;
  live_url: string | null;
  preview_url: string | null;
  status: string;
};

const CLIENT_STATUS_OPTIONS = [
  ["active", "Active"],
  ["paused", "Paused"],
  ["archived", "Archived"],
] as const;

const PROJECT_STATUS_OPTIONS = [
  ["planning", "Planning"],
  ["in_progress", "In progress"],
  ["live", "Live"],
  ["maintenance", "Maintenance"],
] as const;

export function NewClientForm() {
  return (
    <ActionForm action={createClientAction} submit="Create and continue" pendingLabel="Creating…">
      <Field name="businessName" label="Business name" required />
    </ActionForm>
  );
}

export function ClientDetailsForm({ id, name, status }: { id: string; name: string; status: string }) {
  return (
    <ActionForm action={updateClientAction} submit="Save">
      <input type="hidden" name="clientId" value={id} />
      <Field name="businessName" label="Business name" required defaultValue={name} />
      <Select name="status" label="Status" options={CLIENT_STATUS_OPTIONS} defaultValue={status} />
    </ActionForm>
  );
}

export function InviteForm({ clientId }: { clientId: string }) {
  return (
    <ActionForm action={inviteMemberAction} submit="Invite" pendingLabel="Inviting…" resetOnSuccess>
      <input type="hidden" name="clientId" value={clientId} />
      <Field name="email" label="Email" type="email" required />
    </ActionForm>
  );
}

export function RemoveMemberButton({ clientId, userId, email }: { clientId: string; userId: string; email: string }) {
  return (
    <ActionForm
      action={removeMemberAction}
      submit="Remove"
      pendingLabel="Removing…"
      variant="outline"
      confirmText={`Remove ${email}'s access to this client?`}
      inline
    >
      <input type="hidden" name="clientId" value={clientId} />
      <input type="hidden" name="userId" value={userId} />
    </ActionForm>
  );
}

export function ProjectForm({ clientId, project }: { clientId: string; project?: ProjectValues }) {
  return (
    <ActionForm
      action={project ? updateProjectAction : createProjectAction}
      submit={project ? "Save" : "Add project"}
      resetOnSuccess={!project}
    >
      <input type="hidden" name="clientId" value={clientId} />
      {project && <input type="hidden" name="projectId" value={project.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="name" label="Name" required placeholder="Website" defaultValue={project?.name} />
        <Select
          name="status"
          label="Status"
          options={PROJECT_STATUS_OPTIONS}
          defaultValue={project?.status ?? "in_progress"}
        />
        <Field name="repo" label="GitHub repo" placeholder="owner/name" defaultValue={project?.repo ?? ""} />
        <Field name="liveUrl" label="Live URL" type="url" placeholder="https://" defaultValue={project?.live_url ?? ""} />
        <Field
          name="previewUrl"
          label="Preview URL"
          type="url"
          placeholder="https://"
          defaultValue={project?.preview_url ?? ""}
        />
      </div>
    </ActionForm>
  );
}

export function DeleteProjectButton({ clientId, projectId, name }: { clientId: string; projectId: string; name: string }) {
  return (
    <ActionForm
      action={deleteProjectAction}
      submit="Delete project"
      pendingLabel="Deleting…"
      variant="outline"
      confirmText={`Delete ${name}? The client will no longer see it.`}
      inline
    >
      <input type="hidden" name="clientId" value={clientId} />
      <input type="hidden" name="projectId" value={projectId} />
    </ActionForm>
  );
}

export function PasswordForm() {
  return (
    <ActionForm action={setPasswordAction} submit="Save password" resetOnSuccess>
      <Field name="password" label="New password" type="password" autoComplete="new-password" required minLength={10} />
      <Field name="confirm" label="Repeat password" type="password" autoComplete="new-password" required />
    </ActionForm>
  );
}

function ActionForm({
  action,
  submit,
  pendingLabel = "Saving…",
  variant,
  confirmText,
  resetOnSuccess,
  inline,
  children,
}: {
  action: Action;
  submit: string;
  pendingLabel?: string;
  variant?: "outline";
  confirmText?: string;
  resetOnSuccess?: boolean;
  inline?: boolean;
  children: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && resetOnSuccess) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  // Submitting through onSubmit keeps typed values when validation fails; a plain
  // `action` prop would reset the form after every submit.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (confirmText && !window.confirm(confirmText)) return;
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className={inline ? "flex items-center gap-3" : "space-y-3"}>
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="sm" variant={variant} disabled={pending}>
          {pending ? pendingLabel : submit}
        </Button>
        {state && (
          <p className={state.ok ? "text-sm text-muted-foreground" : "text-sm text-destructive"} role="status">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({ name, label, ...props }: { name: string; label: string } & React.ComponentProps<"input">) {
  const id = useId();
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} {...props} />
    </div>
  );
}

function Select({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: readonly (readonly [string, string])[];
  defaultValue: string;
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
      >
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}
