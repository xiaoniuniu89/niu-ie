"use client";

import { useActionState } from "react";
import {
  createClientAction,
  createProjectAction,
  inviteMemberAction,
  type ActionState,
} from "@/app/portal/(app)/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ClientOption = { id: string; name: string };

export function AdminForms({ clients }: { clients: ClientOption[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <FormCard title="New client" action={createClientAction} submit="Create">
        <Field name="businessName" label="Business name" required />
      </FormCard>

      <FormCard title="Invite person" action={inviteMemberAction} submit="Invite" disabled={!clients.length}>
        <ClientSelect clients={clients} />
        <Field name="email" label="Email" type="email" required />
      </FormCard>

      <FormCard title="Link project" action={createProjectAction} submit="Link" disabled={!clients.length}>
        <ClientSelect clients={clients} />
        <Field name="name" label="Name" required placeholder="Website" />
        <Field name="repo" label="GitHub repo" placeholder="owner/name" />
        <Field name="liveUrl" label="Live URL" type="url" placeholder="https://" />
        <Field name="previewUrl" label="Preview URL" type="url" placeholder="https://" />
      </FormCard>
    </div>
  );
}

function FormCard({
  title,
  action,
  submit,
  disabled,
  children,
}: {
  title: string;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submit: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <h2 className="font-semibold">{title}</h2>
      {children}
      <Button type="submit" size="sm" disabled={pending || disabled}>
        {pending ? "Saving…" : submit}
      </Button>
      {state && (
        <p className={state.ok ? "text-sm text-muted-foreground" : "text-sm text-destructive"}>{state.message}</p>
      )}
    </form>
  );
}

function Field({ name, label, ...props }: { name: string; label: string } & React.ComponentProps<"input">) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}

function ClientSelect({ clients }: { clients: ClientOption[] }) {
  return (
    <div className="space-y-1">
      <Label>Client</Label>
      <select
        name="clientId"
        required
        className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
      >
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
