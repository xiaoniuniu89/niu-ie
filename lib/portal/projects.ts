export const PROJECT_STATUS_LABEL: Record<string, string> = {
  planning: "Planning",
  in_progress: "In progress",
  live: "Live",
  maintenance: "Maintenance",
};

export type PortalProject = {
  id: string;
  name: string;
  repo: string | null;
  live_url: string | null;
  preview_url: string | null;
  status: string;
};

export type PortalClient = { id: string; business_name: string; projects: PortalProject[] };

export type ProjectsResponse = { clients: PortalClient[] };

// SWR key for the signed-in user's clients and projects. Shared by the overview and project
// pages, so opening a project reuses what the overview loaded. Invalidate it after admin edits.
export const projectsKey = "/portal/api/projects";

export const projectPath = (projectId: string) => `/portal/projects/${projectId}`;
