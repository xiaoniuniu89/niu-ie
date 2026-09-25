"use client";

import Link from "next/link";
import { preload } from "swr";
import { fetchRequests, requestsKey } from "@/lib/portal/requests";

// Card title link that stretches over the whole card. Starts loading the request list on
// hover or focus, so it's usually ready by the time the project page renders.
export function ProjectCardLink({ projectId, hasRepo, children }: { projectId: string; hasRepo: boolean; children: React.ReactNode }) {
  const warm = () => {
    if (hasRepo) preload(requestsKey(projectId), fetchRequests);
  };

  return (
    <Link
      href={`/portal/projects/${projectId}`}
      onMouseEnter={warm}
      onFocus={warm}
      onTouchStart={warm}
      className="after:absolute after:inset-0 after:rounded-lg focus:outline-none"
    >
      {children}
    </Link>
  );
}
