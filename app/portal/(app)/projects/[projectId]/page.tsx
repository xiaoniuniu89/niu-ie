import { ProjectDetail } from "@/components/portal/ProjectDetail";

// The layout checks the session; RLS on the API routes limits what each user can load.
export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <ProjectDetail projectId={projectId} />;
}
