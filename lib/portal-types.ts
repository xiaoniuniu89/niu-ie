export type ProjectStatus = 
  | "onboarding" 
  | "discovery" 
  | "development" 
  | "staging" 
  | "dns_setup" 
  | "launched";

export type FormBackendMethod = "pageclip" | "smtp" | "custom";

export interface ClientProject {
  id: string;
  name: string;
  companyName: string;
  clientEmail: string;
  clientPhone?: string;
  status: ProjectStatus;
  statusMessage?: string;
  createdAt: string;
  targetLaunchDate?: string;
  urls: {
    live?: string;
    staging?: string;
    github?: string;
    vercel?: string;
    driveFolder?: string;
    figma?: string;
  };
  domain: {
    domainName: string;
    registrar?: string;
    isConfigured: boolean;
    dnsRecordsRequired?: {
      type: "A" | "CNAME";
      name: string;
      value: string;
    }[];
  };
  formSetup: {
    method: FormBackendMethod;
    pageclipFormName?: string;
    pageclipEndpoint?: string;
    isVerified: boolean;
  };
  v1Scope: {
    pages: string[];
    coreFeatures: string[];
    contentReady: boolean;
  };
  productBacklog: {
    id: string;
    title: string;
    category: "feature" | "integration" | "automation" | "content";
    priority: "high" | "medium" | "low";
    notes?: string;
  }[];
}

export interface ComprehensiveRequirements {
  // Step 1: Business Model & Core Value
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  businessSummary: string;
  targetAudience: string;
  servicesOffered: string[];
  customServices: string;
  primaryConversionGoal: "phone_call" | "contact_form" | "quote_request" | "booking" | "direct_purchase" | "other";
  primaryConversionNotes?: string;

  // Step 2: Site Architecture & Content
  pagesRequired: string[];
  customPages?: string;
  contentStatus: "fully_written" | "bullet_points" | "needs_drafting" | "migrating_from_old_site";
  specializedCopyNotes?: string;

  // Step 3: Functional & System Requirements (Deep Dive)
  formMethodPreference: FormBackendMethod;
  bookingNeeded: boolean;
  bookingTool?: string;
  ecommerceNeeded: boolean;
  ecommerceDetails?: string;
  customerPortalNeeded: boolean;
  customerPortalDetails?: string;
  integrationsNeeded: string[];
  customIntegrationNotes?: string;

  // Step 4: Brand Assets & Visual Direction
  assetsDriveUrl: string;
  hasLogo: boolean;
  hasBrandColors: boolean;
  brandColorsDescription?: string;
  referenceSitesLiked: string;
  stylesOrCompetitorsDisliked?: string;

  // Step 5: Technical & Infrastructure
  domainName: string;
  domainRegistrar: string;
  hasDnsAccess: boolean;
  currentEmailProvider: string;

  // Step 6: All Future Product Requirements (Backlog Discovery)
  futureFeatureIdeas: string;
  additionalNotes?: string;
}
