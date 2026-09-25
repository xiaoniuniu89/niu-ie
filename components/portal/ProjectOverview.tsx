"use client";

import Link from "next/link";
import useSWR from "swr";
import { PROJECT_STATUS_LABEL, projectPath, projectsKey, type PortalProject, type ProjectsResponse } from "@/lib/portal/projects";
import { RequestDialog } from "@/components/portal/RequestForms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectOverview({ isAdmin }: { isAdmin: boolean }) {
  const { data, error } = useSWR<ProjectsResponse>(projectsKey);

  if (error) return <p className="text-sm text-destructive">Couldn&apos;t load your projects. Refresh to try again.</p>;
  if (!data) return <OverviewSkeleton />;

  if (!data.clients.length) {
    return (
      <div>
        <h1 className="font-serif text-2xl font-semibold">Welcome</h1>
        <p className="mt-2 text-muted-foreground">
          {isAdmin ? (
            <>
              No clients yet. <Link href="/portal/admin" className="underline">Add one in Admin</Link>.
            </>
          ) : (
            "Your account isn't linked to a business yet. Daniel will set this up shortly."
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {data.clients.map((client) => (
        <section key={client.id}>
          <h1 className="font-serif text-2xl font-semibold">{client.business_name}</h1>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {client.projects.length === 0 && (
              <p className="text-muted-foreground">No projects linked yet.</p>
            )}
            {client.projects.map((project) => (
              // The title link stretches over the whole card; links and buttons inside sit above it.
              <Card
                key={project.id}
                className="relative cursor-pointer transition-colors hover:border-primary/60 focus-within:border-primary/60"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    <Link href={projectPath(project.id)} className="after:absolute after:inset-0 after:rounded-lg focus:outline-none">
                      {project.name}
                    </Link>
                    <Badge variant="secondary">{PROJECT_STATUS_LABEL[project.status] ?? project.status}</Badge>
                  </CardTitle>
                  <CardDescription>Your website and where it lives.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectLinks project={project} />
                </CardContent>
                {project.repo && (
                  <CardFooter>
                    <RequestDialog
                      projectId={project.id}
                      clientId={client.id}
                      defaultType="bug"
                      trigger={<Button size="sm" className="relative z-10">Report an issue</Button>}
                    />
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function ProjectLinks({ project }: { project: PortalProject }) {
  return (
    <ul className="space-y-2 text-sm">
      <ProjectLink label="Live site" href={project.live_url} />
      <ProjectLink label="Preview" href={project.preview_url} />
      <ProjectLink label="Code on GitHub" href={project.repo ? `https://github.com/${project.repo}` : null} />
    </ul>
  );
}

function ProjectLink({ label, href }: { label: string; href: string | null }) {
  return (
    <li className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="relative z-10 truncate text-primary underline-offset-4 hover:underline">
          {href.replace(/^https?:\/\//, "")}
        </a>
      ) : (
        <span className="text-muted-foreground/60">Not set</span>
      )}
    </li>
  );
}

function OverviewSkeleton() {
  return (
    <div aria-busy="true">
      <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="h-56 animate-pulse rounded-lg border bg-muted/40" />
        <div className="h-56 animate-pulse rounded-lg border bg-muted/40" />
      </div>
    </div>
  );
}
