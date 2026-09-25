import { ChevronLeft } from "lucide-react";

// Shown the moment a project card is clicked, while the server checks access to the project.
export default function ProjectLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="h-4 w-4" /> Overview
      </span>
      <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
      <div className="h-40 animate-pulse rounded-lg border bg-muted/40" />
    </div>
  );
}
