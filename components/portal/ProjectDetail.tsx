"use client";

import { useRef, type KeyboardEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { ChevronLeft } from "lucide-react";
import { PROJECT_STATUS_LABEL, projectsKey, type ProjectsResponse } from "@/lib/portal/projects";
import { FEATURE_TYPES, ISSUE_TYPES } from "@/lib/portal/requests";
import { ProjectLinks } from "@/components/portal/ProjectOverview";
import { RequestChat } from "@/components/portal/RequestChat";
import { RequestDialog } from "@/components/portal/RequestForms";
import { RequestList } from "@/components/portal/RequestList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TABS = [
  ["overview", "Overview"],
  ["issues", "Issues"],
  ["features", "Feature requests"],
] as const;

type Tab = (typeof TABS)[number][0];

export function ProjectDetail({ projectId }: { projectId: string }) {
  // Same key as the overview, so a project opened from there renders straight from cache.
  const { data, error } = useSWR<ProjectsResponse>(projectsKey);
  const param = useSearchParams().get("tab");
  const tab: Tab = TABS.find(([value]) => value === param)?.[0] ?? "overview";

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Shallow URL update keeps the tab on refresh without a server round trip.
  function selectTab(next: Tab) {
    window.history.replaceState(null, "", next === "overview" ? window.location.pathname : `?tab=${next}`);
  }

  // WAI-ARIA tabs: arrows wrap, Home/End jump; focus follows selection.
  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = TABS.length - 1;
    const target =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (target === null) return;
    event.preventDefault();
    selectTab(TABS[target][0]);
    tabRefs.current[target]?.focus();
  }

  const back = (
    <Link href="/portal" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ChevronLeft className="h-4 w-4" /> Overview
    </Link>
  );

  if (error) return <p className="text-sm text-destructive">Couldn&apos;t load this project. Refresh to try again.</p>;
  if (!data) return <DetailSkeleton />;

  const client = data.clients.find((c) => c.projects.some((p) => p.id === projectId));
  const project = client?.projects.find((p) => p.id === projectId);
  if (!client || !project) {
    return (
      <div className="space-y-4">
        {back}
        <p className="text-muted-foreground">We couldn&apos;t find this project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {back}

      <div>
        <p className="text-sm text-muted-foreground">{client.business_name}</p>
        <h1 className="mt-1 flex flex-wrap items-center gap-3 font-serif text-2xl font-semibold">
          {project.name}
          <Badge variant="secondary">{PROJECT_STATUS_LABEL[project.status] ?? project.status}</Badge>
        </h1>
      </div>

      <div role="tablist" aria-label="Project sections" className="flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map(([value, label], index) => (
          <button
            key={value}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${value}`}
            aria-selected={tab === value}
            aria-controls={`panel-${value}`}
            tabIndex={tab === value ? 0 : -1}
            onClick={() => selectTab(value)}
            onKeyDown={(event) => onTabKeyDown(event, index)}
            className="-mb-px min-h-11 whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-sm text-muted-foreground hover:text-foreground aria-selected:border-primary aria-selected:font-medium aria-selected:text-foreground md:min-h-0"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Only the open tab mounts, so requests are fetched the first time a request tab opens. */}
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "overview" && (
          <Card>
            <CardHeader>
              <CardTitle>Your website and where it lives</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectLinks project={project} />
            </CardContent>
          </Card>
        )}

        {tab !== "overview" && !project.repo && (
          <p className="text-muted-foreground">
            Requests aren&apos;t set up for this project yet.{" "}
            <Link href="/contact" className="text-primary underline underline-offset-4">
              Contact us
            </Link>{" "}
            in the meantime.
          </p>
        )}

        {tab === "issues" && project.repo && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <RequestDialog projectId={project.id} clientId={client.id} kind="issue" trigger={<Button>Report an issue</Button>} />
              <RequestChat projectId={project.id} kind="issue" />
            </div>
            <RequestList
              projectId={project.id}
              clientId={client.id}
              types={ISSUE_TYPES}
              empty="No issues yet. Use “Report an issue” if something isn't working."
            />
          </div>
        )}

        {tab === "features" && project.repo && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <RequestDialog projectId={project.id} clientId={client.id} kind="feature" trigger={<Button>Request a feature</Button>} />
              <RequestChat projectId={project.id} kind="feature" />
            </div>
            <RequestList
              projectId={project.id}
              clientId={client.id}
              types={FEATURE_TYPES}
              empty="No feature requests yet. Use “Request a feature” to ask for something new."
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
      <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
      <div className="h-40 animate-pulse rounded-lg border bg-muted/40" />
    </div>
  );
}
