"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { submitRequirementsAction } from "@/app/actions/submit-requirements";
import type { ComprehensiveRequirements } from "@/lib/portal-types";
import {
  Briefcase,
  Layers,
  Cpu,
  Palette,
  Globe,
  Rocket,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

const STORAGE_KEY = "niu_portal_onboarding_draft_v1";

const DEFAULT_REQUIREMENTS: ComprehensiveRequirements = {
  businessName: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  businessSummary: "",
  targetAudience: "",
  servicesOffered: [],
  customServices: "",
  primaryConversionGoal: "contact_form",
  primaryConversionNotes: "",

  pagesRequired: ["Home", "About", "Services", "Contact"],
  customPages: "",
  contentStatus: "bullet_points",
  specializedCopyNotes: "",

  formMethodPreference: "pageclip",
  bookingNeeded: false,
  bookingTool: "",
  ecommerceNeeded: false,
  ecommerceDetails: "",
  customerPortalNeeded: false,
  customerPortalDetails: "",
  integrationsNeeded: [],
  customIntegrationNotes: "",

  assetsDriveUrl: "",
  hasLogo: true,
  hasBrandColors: true,
  brandColorsDescription: "",
  referenceSitesLiked: "",
  stylesOrCompetitorsDisliked: "",

  domainName: "",
  domainRegistrar: "Blacknight",
  hasDnsAccess: true,
  currentEmailProvider: "",

  futureFeatureIdeas: "",
  additionalNotes: "",
};

const COMMON_SERVICES = [
  "Custom Fabrication / Manufacturing",
  "Residential & Home Services",
  "Commercial Consulting / B2B",
  "Health & Wellness Clinic",
  "Salon, Hair & Aesthetics",
  "Legal, Accounting & Financial",
  "Construction, Trade & Engineering",
  "Creative, Photography & Design",
];

const COMMON_PAGES = [
  "Home",
  "About Us / Company Story",
  "Services / What We Do",
  "Case Studies / Portfolio",
  "Online Inquiries / Contact",
  "FAQ / Guidance",
  "Pricing & Packages",
  "Privacy Policy & Terms",
];

const COMMON_INTEGRATIONS = [
  "Google Analytics 4 / Tag Manager",
  "Pageclip (Zero-password contact forms)",
  "WhatsApp Direct Chat Button",
  "Stripe Payments / Invoice Links",
  "Calendly / Online Booking",
  "Google Search Console Verification",
  "Instagram / Social Feed Embed",
];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ComprehensiveRequirements>(DEFAULT_REQUIREMENTS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setData((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save changes to localStorage
  const updateData = (fields: Partial<ComprehensiveRequirements>) => {
    setData((prev) => {
      const updated = { ...prev, ...fields };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore quota errors
      }
      return updated;
    });
  };

  const toggleArrayItem = (field: "servicesOffered" | "pagesRequired" | "integrationsNeeded", item: string) => {
    const list = data[field] || [];
    const nextList = list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
    updateData({ [field]: nextList });
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const result = await submitRequirementsAction(data);
      if (result.success) {
        setSubmissionSuccess(true);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
      } else {
        setErrorMessage(result.message || "Failed to submit. Please try again.");
      }
    } catch {
      setErrorMessage("Network error during submission. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: "Business & Offerings", icon: Briefcase },
    { num: 2, title: "V1 Pages & Content", icon: Layers },
    { num: 3, title: "Functional Requirements", icon: Cpu },
    { num: 4, title: "Brand Assets & Media", icon: Palette },
    { num: 5, title: "Domain & Tech Setup", icon: Globe },
    { num: 6, title: "Future Product Backlog", icon: Rocket },
  ];

  if (submissionSuccess) {
    return (
      <Card className="max-w-2xl mx-auto border-emerald-500/20 shadow-xl bg-card">
        <CardContent className="pt-10 pb-10 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-bold text-foreground">
              Product Requirements Captured!
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Your comprehensive project brief has been formatted and submitted directly to our team. We now have everything required to build your V1 launch.
            </p>
          </div>

          <div className="p-4 bg-muted/40 rounded-lg text-left text-xs font-mono space-y-1 max-w-md mx-auto border border-border">
            <p><strong>Business:</strong> {data.businessName}</p>
            <p><strong>Primary Goal:</strong> {data.primaryConversionGoal}</p>
            <p><strong>Pages:</strong> {data.pagesRequired.join(", ")}</p>
            <p><strong>Form Mode:</strong> {data.formMethodPreference === "pageclip" ? "Pageclip (Zero-Password)" : "Direct SMTP"}</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.push("/portal/dashboard")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-condensed tracking-wide"
            >
              Open Your Client Console
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/portal/guides/pageclip-setup")}
              className="font-condensed"
            >
              View Setup Guides
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="font-condensed text-xs mb-1 uppercase tracking-wider text-primary border-primary/30">
              Client Discovery Intake
            </Badge>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              {steps[step - 1].title}
            </h1>
          </div>
          <span className="text-sm font-condensed font-medium text-muted-foreground">
            Step {step} of {steps.length}
          </span>
        </div>

        {/* Step Tabs Indicator */}
        <div className="grid grid-cols-6 gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isDone = s.num < step;
            const isCurrent = s.num === step;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-md border transition-all text-xs ${
                  isCurrent
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                    : isDone
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                    : "border-border text-muted-foreground hover:border-foreground/20"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline font-condensed truncate w-full text-center">
                  {s.num}. {s.title.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wizard Form Card */}
      <Card className="border border-border shadow-md bg-card">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="text-lg font-serif">
            {step === 1 && "Tell us about your business and exact offerings"}
            {step === 2 && "Define your V1 website pages and content status"}
            {step === 3 && "Identify all functional and system requirements"}
            {step === 4 && "Provide brand assets and visual inspirations"}
            {step === 5 && "Technical infrastructure and domain access"}
            {step === 6 && "Exhaustive product requirements & future backlog"}
          </CardTitle>
          <CardDescription className="text-xs">
            {step === 1 && "We need your exact terms and customer audience so we never make up services."}
            {step === 2 && "Version 1 is focused strictly on getting your live website published and operational."}
            {step === 3 && "Choose your contact form routing and any advanced functional systems."}
            {step === 4 && "Provide access to your logos, imagery, and design preferences."}
            {step === 5 && "How we will hook up your custom domain and email notifications."}
            {step === 6 && "Brainstorm all future features and dreams so we can groom them into future releases."}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* STEP 1: Business Model & Offerings */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="businessName" className="font-condensed text-sm font-semibold">
                    Business / Trading Name *
                  </Label>
                  <Input
                    id="businessName"
                    value={data.businessName}
                    onChange={(e) => updateData({ businessName: e.target.value })}
                    placeholder="e.g. Westmeath Timber Crafts Ltd."
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contactName" className="font-condensed text-sm font-semibold">
                    Contact Person Name *
                  </Label>
                  <Input
                    id="contactName"
                    value={data.contactName}
                    onChange={(e) => updateData({ contactName: e.target.value })}
                    placeholder="e.g. Sarah O'Connor"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contactEmail" className="font-condensed text-sm font-semibold">
                    Primary Email Address *
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={data.contactEmail}
                    onChange={(e) => updateData({ contactEmail: e.target.value })}
                    placeholder="info@yourcompany.ie"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contactPhone" className="font-condensed text-sm font-semibold">
                    Primary Contact Phone
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={data.contactPhone}
                    onChange={(e) => updateData({ contactPhone: e.target.value })}
                    placeholder="+353 (0)87 123 4567"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="businessSummary" className="font-condensed text-sm font-semibold">
                  What does your business do? (Core Elevator Pitch) *
                </Label>
                <Textarea
                  id="businessSummary"
                  value={data.businessSummary}
                  onChange={(e) => updateData({ businessSummary: e.target.value })}
                  rows={3}
                  placeholder="Explain what products or services you provide, where you are located, and who benefits..."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="targetAudience" className="font-condensed text-sm font-semibold">
                  Who is your ideal customer / audience?
                </Label>
                <Input
                  id="targetAudience"
                  value={data.targetAudience}
                  onChange={(e) => updateData({ targetAudience: e.target.value })}
                  placeholder="e.g. Homeowners in the Midlands looking for bespoke kitchen renovations"
                />
              </div>

              <div className="space-y-2 pt-2">
                <Label className="font-condensed text-sm font-semibold">
                  Select General Industry Category:
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_SERVICES.map((srv) => (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => toggleArrayItem("servicesOffered", srv)}
                      className={`text-left text-xs p-2.5 rounded-md border transition-colors flex items-center justify-between ${
                        data.servicesOffered.includes(srv)
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <span>{srv}</span>
                      {data.servicesOffered.includes(srv) && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label htmlFor="customServices" className="font-condensed text-sm font-semibold">
                  Your Specific Services In Detail (In your exact words — zero guessing) *
                </Label>
                <Textarea
                  id="customServices"
                  value={data.customServices}
                  onChange={(e) => updateData({ customServices: e.target.value })}
                  rows={4}
                  placeholder="List every individual service or product you offer. Example: 1. Bespoke fitted wardrobes, 2. Acoustic wall slatting, 3. Hardwood door restoration..."
                />
                <p className="text-[11px] text-muted-foreground">
                  The more specific you are here, the better your site copy and SEO structure will be.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label className="font-condensed text-sm font-semibold">
                  Primary Customer Action / Conversion Goal:
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "contact_form", label: "Contact Form / Email" },
                    { id: "phone_call", label: "Direct Phone Call" },
                    { id: "quote_request", label: "Detailed Quote Request" },
                    { id: "booking", label: "Online Booking / Consult" },
                    { id: "direct_purchase", label: "Direct Online Sale" },
                    { id: "other", label: "Portfolio Showcase" },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => updateData({ primaryConversionGoal: goal.id as any })}
                      className={`text-xs p-2.5 rounded-md border text-center font-condensed transition-colors ${
                        data.primaryConversionGoal === goal.id
                          ? "border-secondary bg-secondary/15 text-foreground font-bold"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: V1 Pages & Content */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="font-condensed text-sm font-semibold">
                  Which Pages are Required for Launch (Version 1)?
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_PAGES.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => toggleArrayItem("pagesRequired", page)}
                      className={`text-left text-xs p-2.5 rounded-md border transition-colors flex items-center justify-between ${
                        data.pagesRequired.includes(page)
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <span>{page}</span>
                      {data.pagesRequired.includes(page) && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="customPages" className="font-condensed text-sm font-semibold">
                  Any Other Custom Pages Needed for Launch?
                </Label>
                <Input
                  id="customPages"
                  value={data.customPages}
                  onChange={(e) => updateData({ customPages: e.target.value })}
                  placeholder="e.g. Staff Directory, Wholesale Catalog, Trade Portal link"
                />
              </div>

              <div className="space-y-2 pt-2">
                <Label className="font-condensed text-sm font-semibold">
                  What is the current state of your text content / copy?
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: "fully_written", title: "Complete & Ready", desc: "All paragraphs, bios, and copy are already written." },
                    { id: "bullet_points", title: "Rough Outlines / Bullet Points", desc: "We have the facts and points, but need help polishing into web copy." },
                    { id: "needs_drafting", title: "Need Full Drafting", desc: "We need Niu Web to draft the site copy based on our discovery notes." },
                    { id: "migrating_from_old_site", title: "Migrate from Old Website", desc: "Copy text and media directly over from our current website." },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateData({ contentStatus: item.id as any })}
                      className={`text-left p-3 rounded-md border transition-colors ${
                        data.contentStatus === item.id
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <p className="text-xs font-bold font-condensed">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="specializedCopyNotes" className="font-condensed text-sm font-semibold">
                  Specific Copy or Messaging Instructions
                </Label>
                <Textarea
                  id="specializedCopyNotes"
                  value={data.specializedCopyNotes}
                  onChange={(e) => updateData({ specializedCopyNotes: e.target.value })}
                  rows={3}
                  placeholder="Any certifications (e.g. SafePass, ISO 9001, Guild of Master Craftsmen), warranties, or key slogans..."
                />
              </div>
            </div>
          )}

          {/* STEP 3: Functional & System Requirements */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Form Backend Preference */}
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="text-sm font-serif font-bold text-foreground">
                    Contact Form Routing Method
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  How should visitor inquiries from your website contact form be routed to your inbox?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => updateData({ formMethodPreference: "pageclip" })}
                    className={`p-3 rounded-md border text-left transition-colors ${
                      data.formMethodPreference === "pageclip"
                        ? "border-primary bg-background shadow-sm"
                        : "border-border bg-card/60 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-condensed text-primary">Option A: Pageclip (Recommended)</span>
                      {data.formMethodPreference === "pageclip" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Zero technical setup. No email passwords or SMTP keys required. Inquiries are stored securely and delivered right to your email.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateData({ formMethodPreference: "smtp" })}
                    className={`p-3 rounded-md border text-left transition-colors ${
                      data.formMethodPreference === "smtp"
                        ? "border-primary bg-background shadow-sm"
                        : "border-border bg-card/60 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-condensed">Option B: Google App Password / SMTP</span>
                      {data.formMethodPreference === "smtp" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Direct server-to-server dispatch using your Google Workspace / Gmail account with an App Password.
                    </p>
                  </button>
                </div>
              </div>

              {/* Advanced Features Checklist */}
              <div className="space-y-3">
                <Label className="font-condensed text-sm font-semibold">
                  Required Functional Capabilities:
                </Label>

                {/* Booking */}
                <div className="p-3 border rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold font-condensed">Online Appointment Booking</p>
                      <p className="text-[11px] text-muted-foreground">Allow clients to schedule phone calls or site visits directly on a calendar.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={data.bookingNeeded}
                      onChange={(e) => updateData({ bookingNeeded: e.target.checked })}
                      className="h-4 w-4 rounded border-border"
                    />
                  </div>
                  {data.bookingNeeded && (
                    <Input
                      placeholder="Preferred calendar tool (e.g. Calendly, Acuity, Fresha, or Custom)"
                      value={data.bookingTool}
                      onChange={(e) => updateData({ bookingTool: e.target.value })}
                      className="text-xs mt-2"
                    />
                  )}
                </div>

                {/* E-Commerce */}
                <div className="p-3 border rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold font-condensed">E-Commerce & Online Payments</p>
                      <p className="text-[11px] text-muted-foreground">Taking deposits, selling gift cards, or invoicing customers via Stripe.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={data.ecommerceNeeded}
                      onChange={(e) => updateData({ ecommerceNeeded: e.target.checked })}
                      className="h-4 w-4 rounded border-border"
                    />
                  </div>
                  {data.ecommerceNeeded && (
                    <Textarea
                      placeholder="Detail payment needs (e.g. €50 consult deposit, digital gift vouchers, Stripe invoices)..."
                      value={data.ecommerceDetails}
                      onChange={(e) => updateData({ ecommerceDetails: e.target.value })}
                      rows={2}
                      className="text-xs mt-2"
                    />
                  )}
                </div>

                {/* Customer Accounts */}
                <div className="p-3 border rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold font-condensed">Client Login / Members Area</p>
                      <p className="text-[11px] text-muted-foreground">Do your customers need their own password-protected portal?</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={data.customerPortalNeeded}
                      onChange={(e) => updateData({ customerPortalNeeded: e.target.checked })}
                      className="h-4 w-4 rounded border-border"
                    />
                  </div>
                  {data.customerPortalNeeded && (
                    <Textarea
                      placeholder="Describe what your customers would do inside their portal (view invoices, download certificates, etc.)..."
                      value={data.customerPortalDetails}
                      onChange={(e) => updateData({ customerPortalDetails: e.target.value })}
                      rows={2}
                      className="text-xs mt-2"
                    />
                  )}
                </div>
              </div>

              {/* Integrations checklist */}
              <div className="space-y-2">
                <Label className="font-condensed text-sm font-semibold">
                  Third-Party Tool Integrations:
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_INTEGRATIONS.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleArrayItem("integrationsNeeded", tool)}
                      className={`text-left text-xs p-2.5 rounded-md border transition-colors flex items-center justify-between ${
                        data.integrationsNeeded.includes(tool)
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <span>{tool}</span>
                      {data.integrationsNeeded.includes(tool) && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Brand Assets & Visual Direction */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-1.5 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                <Label htmlFor="assetsDriveUrl" className="font-condensed text-sm font-semibold text-foreground flex items-center gap-1.5">
                  Shared Folder Link (Google Drive / Dropbox / OneDrive / Figma) *
                </Label>
                <Input
                  id="assetsDriveUrl"
                  value={data.assetsDriveUrl}
                  onChange={(e) => updateData({ assetsDriveUrl: e.target.value })}
                  placeholder="https://drive.google.com/drive/folders/your-company-assets"
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  Drop all high-res logos (SVG, PNG), team photos, product imagery, brand guides, and brochures here.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 border rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-condensed">High-Res Logo Available</span>
                    <input
                      type="checkbox"
                      checked={data.hasLogo}
                      onChange={(e) => updateData({ hasLogo: e.target.checked })}
                      className="h-4 w-4 rounded border-border"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Check if you have vector SVG or high-resolution transparent PNG files.</p>
                </div>

                <div className="p-3 border rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-condensed">Existing Brand Colors</span>
                    <input
                      type="checkbox"
                      checked={data.hasBrandColors}
                      onChange={(e) => updateData({ hasBrandColors: e.target.checked })}
                      className="h-4 w-4 rounded border-border"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Check if you have exact HEX codes or established company brand colors.</p>
                </div>
              </div>

              {data.hasBrandColors && (
                <div className="space-y-1.5">
                  <Label htmlFor="brandColorsDescription" className="font-condensed text-sm font-semibold">
                    Brand Color Codes or Description
                  </Label>
                  <Input
                    id="brandColorsDescription"
                    value={data.brandColorsDescription}
                    onChange={(e) => updateData({ brandColorsDescription: e.target.value })}
                    placeholder="e.g. Navy Blue (#0B2154) and Racing Red (#D81324), clean white background"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="referenceSitesLiked" className="font-condensed text-sm font-semibold">
                  Websites You Admire (With specific reasons) *
                </Label>
                <Textarea
                  id="referenceSitesLiked"
                  value={data.referenceSitesLiked}
                  onChange={(e) => updateData({ referenceSitesLiked: e.target.value })}
                  rows={3}
                  placeholder="e.g. https://example.com (love the clean card layout and warm typography), https://another.ie (great mobile navigation)"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stylesOrCompetitorsDisliked" className="font-condensed text-sm font-semibold">
                  Styles, Elements or Competitor Sites You Dislike
                </Label>
                <Textarea
                  id="stylesOrCompetitorsDisliked"
                  value={data.stylesOrCompetitorsDisliked}
                  onChange={(e) => updateData({ stylesOrCompetitorsDisliked: e.target.value })}
                  rows={2}
                  placeholder="e.g. Avoid overly dark backgrounds, no pop-up banners, don't like competitor X's cluttered header..."
                />
              </div>
            </div>
          )}

          {/* STEP 5: Technical Infrastructure & Domain */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="domainName" className="font-condensed text-sm font-semibold">
                    Target Domain Name *
                  </Label>
                  <Input
                    id="domainName"
                    value={data.domainName}
                    onChange={(e) => updateData({ domainName: e.target.value })}
                    placeholder="yourcompany.ie or yourcompany.com"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="domainRegistrar" className="font-condensed text-sm font-semibold">
                    Where is the domain registered?
                  </Label>
                  <Input
                    id="domainRegistrar"
                    value={data.domainRegistrar}
                    onChange={(e) => updateData({ domainRegistrar: e.target.value })}
                    placeholder="Blacknight, LetsHost, GoDaddy, Cloudflare, etc."
                  />
                </div>
              </div>

              <div className="p-3 border rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold font-condensed">Do you have login access to your DNS records?</p>
                    <p className="text-[11px] text-muted-foreground">Access is needed to point your domain to the high-performance Vercel cloud network.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={data.hasDnsAccess}
                    onChange={(e) => updateData({ hasDnsAccess: e.target.checked })}
                    className="h-4 w-4 rounded border-border"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="currentEmailProvider" className="font-condensed text-sm font-semibold">
                  Existing Business Email Provider
                </Label>
                <Input
                  id="currentEmailProvider"
                  value={data.currentEmailProvider}
                  onChange={(e) => updateData({ currentEmailProvider: e.target.value })}
                  placeholder="e.g. Google Workspace, Microsoft 365, cPanel / Webmail, or None"
                />
                <p className="text-[11px] text-muted-foreground">
                  Knowing this ensures we never disrupt your active email MX records during DNS connection.
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: Future Product Backlog Discovery */}
          {step === 6 && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-secondary/15 border border-secondary/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-secondary shrink-0" />
                  <h3 className="text-sm font-serif font-bold text-foreground">
                    Future Product Requirements Discovery
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Version 1 is focused on getting your core website live, fast, and converting. But don't hold back here! Dump every feature, automation, and long-term dream you envision for your business. We will capture all of it so our team can groom it into future prioritized roadmaps.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="futureFeatureIdeas" className="font-condensed text-sm font-semibold">
                  Comprehensive Feature & Capability Backlog *
                </Label>
                <Textarea
                  id="futureFeatureIdeas"
                  value={data.futureFeatureIdeas}
                  onChange={(e) => updateData({ futureFeatureIdeas: e.target.value })}
                  rows={6}
                  placeholder={`Think about things like:
- "In the future, we want an online cost estimator so clients calculate pricing before calling."
- "We'd love an SMS reminder system sent to clients before their booked appointment."
- "A private portal where trade suppliers can download our wholesale price list."
- "Multi-language toggle for Irish (Gaeilge) or German visitors."
- "Automated Google Review requests triggered after a job is marked finished."`}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="additionalNotes" className="font-condensed text-sm font-semibold">
                  Any Other Requirements, Deadlines, or Special Considerations
                </Label>
                <Textarea
                  id="additionalNotes"
                  value={data.additionalNotes}
                  onChange={(e) => updateData({ additionalNotes: e.target.value })}
                  rows={2}
                  placeholder="Target launch date, key events or trade shows coming up, or anything else..."
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-md text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              disabled={step === 1 || isSubmitting}
              className="font-condensed"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Previous
            </Button>

            {step < steps.length ? (
              <Button
                type="button"
                onClick={() => setStep((prev) => Math.min(steps.length, prev + 1))}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-condensed tracking-wide"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-condensed font-bold tracking-wide"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Transmitting Dossier...
                  </>
                ) : (
                  <>
                    Submit Complete Product Brief
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
