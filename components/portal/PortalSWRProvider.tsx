"use client";

import { SWRConfig } from "swr";

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} failed: ${res.status}`);
  return res.json();
}

// Portal data stays cached until a form that changes it invalidates its key. The cache lives
// with the portal layout, so signing out drops it.
export function PortalSWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        provider: () => new Map(),
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
