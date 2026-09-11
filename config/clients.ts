import { ClientProject } from "@/lib/portal-types";

/**
 * Code-based Client Project Store
 * Follows Niu.ie's Zero-Database architecture: projects are defined in code or loaded dynamically.
 * Daniel can easily add or edit client projects here as projects advance.
 */
export const CLIENT_PROJECTS: Record<string, ClientProject> = {
  // Demo / Example client project to showcase the dashboard immediately
  "demo-client": {
    id: "demo-client",
    name: "Sample Client Project",
    companyName: "Midlands Craft Works",
    clientEmail: "client@example.com",
    clientPhone: "+353 (0)87 123 4567",
    status: "development",
    statusMessage: "V1 Core website architecture and responsive components are currently being built.",
    createdAt: "2026-09-01",
    targetLaunchDate: "2026-10-15",
    urls: {
      live: "https://midlandscraftworks.ie",
      staging: "https://midlands-craft-works-git-preview.vercel.app",
      github: "https://github.com/xiaoniuniu89/midlands-craft-works",
      vercel: "https://vercel.com/niu-web/midlands-craft-works",
      driveFolder: "https://drive.google.com/drive/folders/sample-client-assets",
      figma: "https://figma.com/file/sample-project-wireframes",
    },
    domain: {
      domainName: "midlandscraftworks.ie",
      registrar: "Blacknight",
      isConfigured: false,
      dnsRecordsRequired: [
        { type: "A", name: "@", value: "76.76.21.21" },
        { type: "CNAME", name: "www", value: "cname.vercel-dns.com" },
      ],
    },
    formSetup: {
      method: "pageclip",
      pageclipFormName: "midlands-contact",
      pageclipEndpoint: "https://send.pageclip.co/sample-key/midlands-contact",
      isVerified: true,
    },
    v1Scope: {
      pages: ["Home", "About Crafting Process", "Custom Joinery Services", "Portfolio Gallery", "Contact & Inquiries"],
      coreFeatures: [
        "High-performance mobile-first responsive layout",
        "Pageclip instant lead contact form",
        "Local SEO schema for Westmeath craft & carpentry",
        "Interactive photo gallery of completed bespoke projects",
      ],
      contentReady: true,
    },
    productBacklog: [
      {
        id: "feat-1",
        title: "Online Estimate & Timber Cost Calculator",
        category: "feature",
        priority: "high",
        notes: "Allows clients to input room dimensions and get an instant guide price before submitting an inquiry.",
      },
      {
        id: "feat-2",
        title: "Stripe Deposit & Booking for Consultations",
        category: "feature",
        priority: "medium",
        notes: "Take a €50 deposit for on-site design consultation.",
      },
      {
        id: "feat-3",
        title: "Client Portal for In-Progress Project Photos",
        category: "feature",
        priority: "low",
        notes: "A private view where homeowners can track wood cutting and staining progress photos.",
      },
      {
        id: "feat-4",
        title: "Automated Google Review Follow-up Email",
        category: "automation",
        priority: "medium",
        notes: "Sends a review link 7 days after project handover.",
      },
    ],
  },
};

/**
 * Resolves a client project by email or ID, with fallback to demo client.
 */
export function getClientProject(identifier?: string | null): ClientProject {
  // If explicitly requesting demo-client
  if (identifier === "demo-client") {
    return CLIENT_PROJECTS["demo-client"];
  }

  if (!identifier) {
    return {
      id: "unassigned",
      name: "New Project",
      companyName: "Your Project",
      clientEmail: "",
      status: "onboarding",
      statusMessage: "Please complete your initial product requirements intake.",
      createdAt: new Date().toISOString().split("T")[0],
      urls: {},
      domain: {
        domainName: "Pending Configuration",
        isConfigured: false,
      },
      formSetup: {
        method: "pageclip",
        isVerified: false,
      },
      v1Scope: {
        pages: [],
        coreFeatures: [],
        contentReady: false,
      },
      productBacklog: [],
    };
  }

  // Match by ID
  if (CLIENT_PROJECTS[identifier]) {
    return CLIENT_PROJECTS[identifier];
  }

  // Match by email
  const match = Object.values(CLIENT_PROJECTS).find(
    (p) => p.clientEmail.toLowerCase() === identifier.toLowerCase()
  );
  if (match) return match;

  // New authenticated user: start in onboarding state, zero mock data exposed
  return {
    id: identifier.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    name: "New Client Project",
    companyName: "Your Workspace",
    clientEmail: identifier,
    status: "onboarding",
    statusMessage: "Welcome! Complete your product discovery intake so Daniel can generate your V1 launch scope.",
    createdAt: new Date().toISOString().split("T")[0],
    urls: {},
    domain: {
      domainName: "Pending Configuration",
      isConfigured: false,
    },
    formSetup: {
      method: "pageclip",
      isVerified: false,
    },
    v1Scope: {
      pages: [],
      coreFeatures: [],
      contentReady: false,
    },
    productBacklog: [],
  };
}
