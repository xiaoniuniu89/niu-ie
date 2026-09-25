"use client";

import Link from "next/link";
import useSWR from "swr";
import { PROJECT_STATUS_LABEL, projectPath, projectsKey, type PortalProject, type ProjectsResponse } from "@/lib/portal/projects";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
            "Your account isn't linked to a business yet. We'll set this up for you."
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
          {client.projects.length === 0 ? (
            <p className="mt-4 text-muted-foreground">No projects linked yet.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-2 font-medium">Project</th>
                    <th scope="col" className="px-4 py-2 font-medium">Status</th>
                    <th scope="col" className="hidden px-4 py-2 font-medium sm:table-cell">Live site</th>
                    <th scope="col" className="px-4 py-2"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {client.projects.map((project) => (
                    <tr key={project.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium">{project.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">{PROJECT_STATUS_LABEL[project.status] ?? project.status}</Badge>
                      </td>
                      <td className="hidden max-w-64 px-4 py-3 sm:table-cell">
                        {project.live_url ? (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-primary underline-offset-4 hover:underline"
                          >
                            {project.live_url.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <span className="text-muted-foreground/60">Not set</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={projectPath(project.id)}>
                            View more
                            <ChevronRight className="h-4 w-4" aria-hidden />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
        <a href={href} target="_blank" rel="noopener noreferrer" className="truncate text-primary underline-offset-4 hover:underline">
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
      <div className="mt-4 h-40 animate-pulse rounded-lg border bg-muted/40" />
    </div>
  );
}
