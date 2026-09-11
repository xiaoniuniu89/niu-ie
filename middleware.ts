import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedPortalRoute = createRouteMatcher([
  "/portal/dashboard(.*)",
  "/portal/onboarding(.*)",
  "/portal/guides(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedPortalRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/portal", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
