import Link from "next/link";
import { requireUser } from "@/lib/portal/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequestDialog } from "@/components/portal/RequestForms";

const STATUS_LABEL: Record<string, string> = {
  planning: "Planning",
  in_progress: "In progress",
  live: "Live",
  maintenance: "Maintenance",
};

export default async function OverviewPage() {
  const { supabase, isAdmin } = await requireUser();

  // RLS limits both queries to the signed-in user's clients.
  const { data: clients } = await supabase
    .from("clients")
    .select("id, business_name, projects (id, name, repo, live_url, preview_url, status)")
    .order("business_name");

  if (!clients?.length) {
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
      {clients.map((client) => (
        <section key={client.id}>
          <h1 className="font-serif text-2xl font-semibold">{client.business_name}</h1>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {client.projects.length === 0 && (
              <p className="text-muted-foreground">No projects linked yet.</p>
            )}
            {client.projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    {project.name}
                    <Badge variant="secondary">{STATUS_LABEL[project.status] ?? project.status}</Badge>
                  </CardTitle>
                  <CardDescription>Your website and where it lives.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <ProjectLink label="Live site" href={project.live_url} />
                    <ProjectLink label="Preview" href={project.preview_url} />
                    <ProjectLink label="Code on GitHub" href={project.repo ? `https://github.com/${project.repo}` : null} />
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center gap-3">
                  {project.repo && (
                    <RequestDialog
                      projectId={project.id}
                      clientId={client.id}
                      liveUrl={project.live_url}
                      trigger={<Button size="sm">Report an issue</Button>}
                    />
                  )}
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/portal/projects/${project.id}`}>View requests</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
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
