"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIntl, FormattedMessage } from "react-intl";
import { sendSampleRequestEmail } from "@/app/actions/contact";
import { sampleRequestSchema, type SampleRequestData } from "@/lib/contact-schemas";
import { KB_DESIGN_OPTIONS, KBDesignOption } from "@/lib/kb-designs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Link as LinkIcon,
  Layers,
  Building2,
  Send,
  FileCheck,
  FileCode,
  Files,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Check,
  FolderUp,
  UploadCloud,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

const AVAILABLE_PAGES = [
  "Home Page",
  "About Us Page",
  "Contact / Inquiry Page",
  "Services & Pricing Grid",
  "Portfolio / Case Studies Gallery",
  "FAQ & Help Center",
  "Online Booking / Request Form",
];

const INDUSTRIES = [
  "Trades & Local Services (Plumbing, Garage, Electrician, Cleaning)",
  "Salon, Hair, Spa & Beauty Lounge",
  "Mental Health, Psychotherapy & Wellness Clinic",
  "Gardening, Landscaping & Artisan Craft",
  "E-Commerce & Retail Shopfront",
  "Professional & Financial Consultancy",
  "Charity & Community Organization",
  "Other / Independent Enterprise",
];

const PRIMARY_GOALS = [
  "Drive phone calls & direct quote inquiries",
  "Establish professional local search credibility on Google",
  "Enable fast online booking / appointment requests",
  "Showcase portfolio & recent project work",
  "Modernize an old / outdated existing website",
];

export function WebsiteSampleWizard() {
  const intl = useIntl();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Modal Lightbox Carousel State
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const form = useForm<SampleRequestData>({
    resolver: zodResolver(sampleRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      siteStructure: "multi-page",
      pages: ["Home Page", "About Us Page", "Contact / Inquiry Page"],
      hasDesign: "no",
      designLink: "",
      referenceLinks: "",
      selectedKbDesigns: ["clean-service-branding"],
      industry: INDUSTRIES[0],
      primaryGoal: PRIMARY_GOALS[0],
      businessAssetLinks: "",
      uploadedDriveFileNames: "",
      additionalNotes: "",
    },
  });

  const watchSiteStructure = form.watch("siteStructure");
  const watchHasDesign = form.watch("hasDesign");
  const watchSelectedKbDesigns = form.watch("selectedKbDesigns") || [];
  const watchPages = form.watch("pages") || [];

  const activePreviewOption: KBDesignOption | null =
    previewIndex !== null ? KB_DESIGN_OPTIONS[previewIndex] : null;

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof SampleRequestData)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["name", "email", "siteStructure", "pages"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["hasDesign", "designLink", "selectedKbDesigns"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["industry", "primaryGoal"];
    }

    const isStepValid = await form.trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleKbDesign = (designId: string) => {
    const current = [...watchSelectedKbDesigns];
    const index = current.indexOf(designId);

    if (index > -1) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      if (current.length < 3) {
        current.push(designId);
      }
    }
    form.setValue("selectedKbDesigns", current, { shouldValidate: true });
  };

  const togglePageSelection = (pageName: string) => {
    const current = [...watchPages];
    const index = current.indexOf(pageName);
    if (index > -1) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      if (current.length < 3) {
        current.push(pageName);
      }
    }
    form.setValue("pages", current, { shouldValidate: true });
  };

  const navigatePreview = (direction: "prev" | "next") => {
    if (previewIndex === null) return;
    if (direction === "prev") {
      setPreviewIndex(
        (previewIndex - 1 + KB_DESIGN_OPTIONS.length) % KB_DESIGN_OPTIONS.length
      );
    } else {
      setPreviewIndex((previewIndex + 1) % KB_DESIGN_OPTIONS.length);
    }
  };

  async function onSubmit(values: SampleRequestData) {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await sendSampleRequestEmail(values);
      setSubmitStatus({
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        form.reset({
          name: "",
          email: "",
          phone: "",
          company: "",
          siteStructure: "multi-page",
          pages: ["Home Page", "About Us Page", "Contact / Inquiry Page"],
          hasDesign: "no",
          designLink: "",
          referenceLinks: "",
          selectedKbDesigns: ["clean-service-branding"],
          industry: INDUSTRIES[0],
          primaryGoal: PRIMARY_GOALS[0],
          businessAssetLinks: "",
          uploadedDriveFileNames: "",
          additionalNotes: "",
        });
        setCurrentStep(1);
      }
    } catch {
      setSubmitStatus({
        success: false,
        message: intl.formatMessage({ id: "contact.error" }),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-2xl border shadow-sm">
      {/* Wizard Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-condensed font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          <span>
            <FormattedMessage
              id="wizard.step"
              values={{ current: currentStep, total: 4 }}
            />
          </span>
          <span className="text-primary font-bold">
            {currentStep === 1 && "1. Contact & Scope"}
            {currentStep === 2 && "2. Design Preferences"}
            {currentStep === 3 && "3. Business Context & Assets"}
            {currentStep === 4 && "4. Review & Submit"}
          </span>
        </div>

        {/* Step Indicator Bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex gap-1">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-full flex-1 transition-all duration-300 ${
                step <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {submitStatus && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-condensed flex items-center justify-between gap-3 ${
            submitStatus.success
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-300"
          }`}
        >
          <span>{submitStatus.message}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSubmitStatus(null)}
            className="text-xs font-bold underline p-0 h-auto text-current hover:bg-transparent"
          >
            Dismiss
          </Button>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          {/* STEP 1: Contact & Target Page Scope */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div>
                <h3 className="text-2xl font-serif text-primary flex items-center gap-2">
                  <Layers className="w-6 h-6 text-secondary" />
                  <FormattedMessage id="wizard.step1.title" />
                </h3>
                <p className="text-sm text-muted-foreground font-condensed mt-1">
                  <FormattedMessage id="wizard.step1.sub" />
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans font-semibold">
                        <FormattedMessage id="contact.nameLabel" /> *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={intl.formatMessage({ id: "contact.namePlaceholder" })} {...field} className="font-condensed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans font-semibold">
                        <FormattedMessage id="contact.emailLabel" /> *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={intl.formatMessage({ id: "contact.emailPlaceholder" })} {...field} className="font-condensed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans font-semibold">
                        <FormattedMessage id="wizard.phoneLabel" />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={intl.formatMessage({ id: "wizard.phonePlaceholder" })} {...field} className="font-condensed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans font-semibold">
                        <FormattedMessage id="wizard.companyLabel" />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={intl.formatMessage({ id: "wizard.companyPlaceholder" })} {...field} className="font-condensed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Site Structure Selector (Single-Page vs Multi-Page) */}
              <div>
                <FormLabel className="font-sans font-semibold block mb-2">
                  <FormattedMessage id="wizard.siteStructureLabel" /> *
                </FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => form.setValue("siteStructure", "multi-page")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      watchSiteStructure === "multi-page"
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                      <Files className="w-4 h-4 text-primary" />
                      <FormattedMessage id="wizard.multiPageTitle" />
                    </div>
                    <p className="text-xs text-muted-foreground font-condensed">
                      <FormattedMessage id="wizard.multiPageSub" />
                    </p>
                  </div>

                  <div
                    onClick={() => form.setValue("siteStructure", "single-page")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      watchSiteStructure === "single-page"
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                      <FileCode className="w-4 h-4 text-secondary" />
                      <FormattedMessage id="wizard.singlePageTitle" />
                    </div>
                    <p className="text-xs text-muted-foreground font-condensed">
                      <FormattedMessage id="wizard.singlePageSub" />
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Pages Checkboxes (Capped at Max 3) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <FormLabel className="font-sans font-semibold">
                    <FormattedMessage id="wizard.pagesLabel" /> *
                  </FormLabel>
                  <span className="text-xs font-condensed text-muted-foreground">
                    Selected: <strong className="text-primary">{watchPages.length}</strong> / 3 (Max 3)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_PAGES.map((pageName) => {
                    const isChecked = watchPages.includes(pageName);
                    const isMaxReached = watchPages.length >= 3 && !isChecked;

                    return (
                      <div
                        key={pageName}
                        onClick={() => {
                          if (!isMaxReached) togglePageSelection(pageName);
                        }}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                          isMaxReached ? "opacity-50 cursor-not-allowed bg-background" : "cursor-pointer"
                        } ${
                          isChecked
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border hover:border-primary/40 bg-background"
                        }`}
                      >
                        <Checkbox checked={isChecked} disabled={isMaxReached} onCheckedChange={() => togglePageSelection(pageName)} />
                        <span className="text-sm font-condensed font-medium text-foreground">{pageName}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground font-condensed mt-2">
                  <FormattedMessage id="wizard.maxPagesNotice" />
                </p>

                {form.formState.errors.pages && (
                  <p className="text-xs text-red-500 mt-2">{form.formState.errors.pages.message}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Design Preference & Concept Style Showcase */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div>
                <h3 className="text-2xl font-serif text-primary flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-secondary" />
                  <FormattedMessage id="wizard.step2.title" />
                </h3>
                <p className="text-sm text-muted-foreground font-condensed mt-1">
                  <FormattedMessage id="wizard.step2.sub" />
                </p>
              </div>

              {/* Design Choice Radio Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => form.setValue("hasDesign", "no")}
                  className={`p-4.5 rounded-xl border cursor-pointer transition-all ${
                    watchHasDesign === "no"
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border hover:border-primary/40 bg-background"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span><FormattedMessage id="wizard.hasDesignNo" /></span>
                  </div>
                  <p className="text-xs text-muted-foreground font-condensed">
                    Select 1 to 3 visual design concepts below to guide your website preview layout.
                  </p>
                </div>

                <div
                  onClick={() => form.setValue("hasDesign", "yes")}
                  className={`p-4.5 rounded-xl border cursor-pointer transition-all ${
                    watchHasDesign === "yes"
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border hover:border-primary/40 bg-background"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                    <LinkIcon className="w-4 h-4 text-secondary" />
                    <span>Provide Custom Design Link</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-condensed">
                    You have a Figma file, existing website, or reference link.
                  </p>
                </div>
              </div>

              {/* Option A: Custom Link Provided */}
              {watchHasDesign === "yes" ? (
                <div className="space-y-4 p-5 bg-muted/30 rounded-xl border border-dashed border-border">
                  <FormField
                    control={form.control}
                    name="designLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans font-semibold">
                          <FormattedMessage id="wizard.designLinkLabel" /> *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={intl.formatMessage({ id: "wizard.designLinkPlaceholder" })}
                            {...field}
                            className="font-condensed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="referenceLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans font-semibold">
                          <FormattedMessage id="wizard.referenceLinksLabel" />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={intl.formatMessage({ id: "wizard.referenceLinksPlaceholder" })}
                            className="min-h-[80px] font-condensed text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                /* Option B: Concept Styles Showcase Grid with Screenshot Previews & Lightbox Zoom Button */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="font-sans font-semibold text-sm">
                      <FormattedMessage id="wizard.kbSelectTitle" />
                    </FormLabel>
                    <span className="text-xs font-condensed text-muted-foreground">
                      Selected: <strong className="text-primary">{watchSelectedKbDesigns.length}</strong> / 3 (Max 3)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {KB_DESIGN_OPTIONS.map((option, idx) => {
                      const isSelected = watchSelectedKbDesigns.includes(option.id);
                      return (
                        <Card
                          key={option.id}
                          className={`group cursor-pointer transition-all border rounded-xl overflow-hidden ${
                            isSelected
                              ? "border-primary ring-2 ring-primary/20 shadow-md bg-primary/[0.02]"
                              : "border-border hover:border-primary/40 bg-background"
                          }`}
                        >
                          {/* Visual Screenshot Banner + Expand Zoom Hover Action */}
                          <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-muted">
                            <Image
                              src={option.imageSrc}
                              alt={option.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 50vw"
                              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300" />

                            {/* Category Badge */}
                            <Badge className="absolute bottom-3 left-3 bg-background/90 text-foreground backdrop-blur-sm text-[11px] font-semibold border shadow-sm">
                              {option.category}
                            </Badge>

                            {/* Checkmark Indicator */}
                            <div
                              onClick={() => toggleKbDesign(option.id)}
                              className={`absolute top-3 right-3 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                                isSelected ? "bg-primary border-primary text-primary-foreground shadow-md" : "bg-background/90 border-border text-muted-foreground hover:border-primary"
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </div>

                            {/* Zoom Preview Trigger */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewIndex(idx);
                              }}
                              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <Button
                                type="button"
                                size="sm"
                                className="bg-background text-foreground hover:bg-background/90 font-condensed font-bold gap-1.5 shadow-lg border rounded-full text-xs"
                              >
                                <Maximize2 className="w-3.5 h-3.5 text-primary" />
                                Inspect Full Screenshot & Specs
                              </Button>
                            </div>
                          </div>

                          <CardContent className="p-4.5 space-y-3" onClick={() => toggleKbDesign(option.id)}>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-base text-foreground leading-snug">{option.name}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewIndex(idx);
                                }}
                                className="h-7 w-7 text-muted-foreground hover:text-primary shrink-0"
                                title="Expand Preview"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <p className="text-xs text-muted-foreground font-condensed leading-relaxed">
                              {option.description}
                            </p>

                            {/* Feature Pills */}
                            <div className="flex flex-wrap gap-1">
                              {option.keyFeatures.slice(0, 3).map((feat, fIdx) => (
                                <Badge key={fIdx} variant="outline" className="text-[10px] bg-muted/30 font-condensed font-normal">
                                  {feat}
                                </Badge>
                              ))}
                            </div>

                            {/* Color Tokens Preview */}
                            <div className="flex items-center justify-between pt-2 border-t text-[11px] font-condensed">
                              <span className="text-muted-foreground">{option.colorPalette.name}</span>
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                                  style={{ backgroundColor: option.colorPalette.primaryHex }}
                                  title={`Primary ${option.colorPalette.primaryHex}`}
                                />
                                <div
                                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                                  style={{ backgroundColor: option.colorPalette.secondaryHex }}
                                  title={`Secondary ${option.colorPalette.secondaryHex}`}
                                />
                                <div
                                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                                  style={{ backgroundColor: option.colorPalette.backgroundHex }}
                                  title={`Background ${option.colorPalette.backgroundHex}`}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Business Context & Assets */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div>
                <h3 className="text-2xl font-serif text-primary flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-secondary" />
                  <FormattedMessage id="wizard.step3.title" />
                </h3>
                <p className="text-sm text-muted-foreground font-condensed mt-1">
                  <FormattedMessage id="wizard.step3.sub" />
                </p>
              </div>

              {/* Industry Selection */}
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans font-semibold block">
                      <FormattedMessage id="wizard.industryLabel" /> *
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm font-condensed focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Primary Goal Selection */}
              <FormField
                control={form.control}
                name="primaryGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans font-semibold block">
                      <FormattedMessage id="wizard.primaryGoalLabel" /> *
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm font-condensed focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {PRIMARY_GOALS.map((goal) => (
                          <option key={goal} value={goal}>
                            {goal}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Secure Google Drive Upload Box */}
              <div className="p-5 bg-muted/40 border border-dashed border-primary/30 rounded-2xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <FolderUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        <FormattedMessage id="wizard.driveDropTitle" />
                      </h4>
                      <p className="text-xs text-muted-foreground font-condensed mt-0.5">
                        <FormattedMessage id="wizard.driveDropSub" />
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="hidden sm:flex items-center gap-1 text-[10px] bg-background text-green-700 dark:text-green-400 border-green-300 shrink-0">
                    <ShieldCheck className="w-3 h-3" /> Virus Scanned
                  </Badge>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={process.env.NEXT_PUBLIC_GOOGLE_DRIVE_UPLOAD_URL || "https://drive.google.com/drive/folders/1ZiVxr1gCyo-zmeX80l1yJvmEe5HWse8t?usp=drive_link"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      type="button"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-condensed font-bold text-xs gap-2 rounded-xl h-10 px-5 shadow-sm"
                    >
                      <UploadCloud className="w-4 h-4 text-secondary" />
                      <FormattedMessage id="wizard.driveDropBtn" />
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </Button>
                  </a>
                  <span className="text-xs text-muted-foreground font-condensed">
                    Direct drop folder • No Google login required
                  </span>
                </div>

                {/* File Names Linkage Field */}
                <div className="pt-2 border-t">
                  <FormField
                    control={form.control}
                    name="uploadedDriveFileNames"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans font-semibold text-xs text-foreground">
                          <FormattedMessage id="wizard.driveFileNamesLabel" />
                        </FormLabel>
                        <p className="text-[11px] text-muted-foreground font-condensed -mt-1">
                          <FormattedMessage id="wizard.driveFileNamesSub" />
                        </p>
                        <FormControl>
                          <Input
                            placeholder={intl.formatMessage({ id: "wizard.driveFileNamesPlaceholder" })}
                            className="font-condensed text-xs h-9 bg-background"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Personal Resources & Branding Asset Links */}
              <FormField
                control={form.control}
                name="businessAssetLinks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans font-semibold">
                      <FormattedMessage id="wizard.assetLinksLabel" />
                    </FormLabel>
                    <p className="text-xs text-muted-foreground font-condensed -mt-1">
                      <FormattedMessage id="wizard.assetLinksSub" />
                    </p>
                    <FormControl>
                      <Textarea
                        placeholder={intl.formatMessage({ id: "wizard.assetLinksPlaceholder" })}
                        className="min-h-[90px] font-condensed text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans font-semibold">
                      <FormattedMessage id="wizard.notesLabel" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={intl.formatMessage({ id: "wizard.notesPlaceholder" })}
                        className="min-h-[100px] font-condensed text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* STEP 4: Review & Submit Summary */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div>
                <h3 className="text-2xl font-serif text-primary flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-secondary" />
                  <FormattedMessage id="wizard.step4.title" />
                </h3>
                <p className="text-sm text-muted-foreground font-condensed mt-1">
                  <FormattedMessage id="wizard.step4.sub" />
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-muted/40 p-6 rounded-xl border space-y-4 font-condensed">
                <div className="border-b pb-3">
                  <h4 className="font-bold text-xs uppercase text-muted-foreground mb-1">Contact Details</h4>
                  <p className="text-sm font-semibold text-foreground">{form.getValues("name")} &lt;{form.getValues("email")}&gt;</p>
                  {form.getValues("phone") && <p className="text-xs text-muted-foreground">Phone: {form.getValues("phone")}</p>}
                  {form.getValues("company") && <p className="text-xs text-muted-foreground">Company: {form.getValues("company")}</p>}
                </div>

                <div className="border-b pb-3">
                  <h4 className="font-bold text-xs uppercase text-muted-foreground mb-1">Site Layout & Target Pages</h4>
                  <p className="text-xs text-foreground font-medium mb-1.5">
                    <strong>Structure:</strong> {watchSiteStructure === "single-page" ? "Single-Page (1-Page Scroll)" : "Multi-Page (Up to 3 Pages)"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {watchPages.map((page) => (
                      <Badge key={page} variant="outline" className="bg-background text-xs">
                        {page}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-b pb-3">
                  <h4 className="font-bold text-xs uppercase text-muted-foreground mb-1">Design Path & Concept Styles</h4>
                  {watchHasDesign === "yes" ? (
                    <p className="text-sm text-primary font-semibold break-all">
                      Design Link: {form.getValues("designLink") || "Not specified"}
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {watchSelectedKbDesigns.map((id) => {
                        const opt = KB_DESIGN_OPTIONS.find((k) => k.id === id);
                        return (
                          <Badge key={id} className="bg-secondary text-secondary-foreground text-xs">
                            {opt?.name || id}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase text-muted-foreground mb-1">Scope & Assets</h4>
                  <p className="text-xs text-foreground"><strong>Industry:</strong> {form.getValues("industry")}</p>
                  <p className="text-xs text-foreground"><strong>Primary Goal:</strong> {form.getValues("primaryGoal")}</p>
                  {form.getValues("uploadedDriveFileNames") && (
                    <p className="text-xs text-primary font-semibold mt-1 break-all">
                      <strong>Uploaded Drive Files:</strong> {form.getValues("uploadedDriveFileNames")}
                    </p>
                  )}
                  {form.getValues("businessAssetLinks") && (
                    <p className="text-xs text-foreground mt-1 break-all">
                      <strong>Resource & Branding Links:</strong> {form.getValues("businessAssetLinks")}
                    </p>
                  )}
                </div>
              </div>

              {submitStatus && (
                <div
                  className={`p-4 rounded-xl text-sm font-condensed ${
                    submitStatus.success
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-300"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}
            </div>
          )}

          {/* Navigation Control Buttons */}
          <div className="flex items-center justify-between pt-6 border-t mt-8">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="font-condensed font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <FormattedMessage id="wizard.backBtn" />
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="font-condensed font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <FormattedMessage id="wizard.nextBtn" />
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || submitStatus?.success}
                className="font-condensed font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8"
              >
                {isSubmitting ? (
                  <FormattedMessage id="wizard.submitting" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    <FormattedMessage id="wizard.submitBtn" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* FULL SCREENSHOT LIGHTBOX CAROUSEL DIALOG */}
      {activePreviewOption && previewIndex !== null && (
        <Dialog open={previewIndex !== null} onOpenChange={() => setPreviewIndex(null)}>
          <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col bg-background border rounded-2xl shadow-2xl">
            {/* Modal Navigation Header */}
            <div className="p-4 sm:p-5 border-b bg-card flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <Badge className="bg-secondary text-secondary-foreground text-xs">
                  {activePreviewOption.category}
                </Badge>
                <div>
                  <DialogTitle className="text-base sm:text-xl font-bold font-serif text-primary">
                    {activePreviewOption.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground font-condensed">
                    Concept Style {previewIndex + 1} of {KB_DESIGN_OPTIONS.length} • {activePreviewOption.vibeTag}
                  </DialogDescription>
                </div>
              </div>

              {/* Action & Carousel Controls */}
              <div className="flex items-center gap-2 pr-8">
                {/* Carousel Prev/Next Buttons */}
                <div className="flex items-center border rounded-lg overflow-hidden bg-background">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigatePreview("prev")}
                    className="h-9 px-2.5 text-muted-foreground hover:text-foreground"
                    title="Previous Concept"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                  </Button>
                  <div className="w-[1px] h-4 bg-border" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigatePreview("next")}
                    className="h-9 px-2.5 text-muted-foreground hover:text-foreground"
                    title="Next Concept"
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                {/* Direct Select/Deselect Toggle Button inside Modal */}
                {(() => {
                  const isSelected = watchSelectedKbDesigns.includes(activePreviewOption.id);
                  return (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => toggleKbDesign(activePreviewOption.id)}
                      className={`font-condensed font-bold gap-1.5 text-xs transition-all ${
                        isSelected
                          ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4" /> Selected Style
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" /> Select This Style
                        </>
                      )}
                    </Button>
                  );
                })()}
              </div>
            </div>

            {/* Modal Body: Split Layout (Left: Full Scrollable Screenshot, Right: Specs) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
              {/* Left Side: Virtual Desktop Browser Frame with Full Vertical Scroll */}
              <div className="lg:col-span-2 bg-muted/40 p-4 sm:p-6 overflow-y-auto flex flex-col items-center">
                <div className="w-full max-w-3xl border rounded-xl bg-background shadow-lg overflow-hidden flex flex-col">
                  {/* Virtual Browser Top Window Bar */}
                  <div className="bg-muted px-4 py-2.5 border-b flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[11px] font-condensed font-mono text-muted-foreground truncate max-w-xs">
                      https://niu.ie/concepts/{activePreviewOption.id}
                    </span>
                    <div className="w-10" />
                  </div>

                  {/* High Resolution Full Desktop Page Screenshot (Scrollable) */}
                  <div className="relative w-full">
                    <img
                      src={activePreviewOption.imageSrc}
                      alt={activePreviewOption.name}
                      className="w-full h-auto object-top block"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side: Concept Blueprint Specs & Color Tokens Sidebar */}
              <div className="p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l space-y-6 bg-card">
                <div>
                  <h4 className="font-bold text-xs uppercase text-muted-foreground tracking-wider mb-2">Design Concept Vibe</h4>
                  <p className="text-sm text-foreground font-condensed leading-relaxed">
                    {activePreviewOption.description}
                  </p>
                </div>

                {/* Key Layout Features */}
                <div>
                  <h4 className="font-bold text-xs uppercase text-muted-foreground tracking-wider mb-2">Key Layout Triggers</h4>
                  <div className="space-y-1.5">
                    {activePreviewOption.keyFeatures.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-condensed text-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Palette Specification */}
                <div className="p-4 rounded-xl bg-muted/40 border space-y-3">
                  <h4 className="font-bold text-xs uppercase text-muted-foreground tracking-wider">
                    Theme Palette: {activePreviewOption.colorPalette.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-condensed">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border shadow-xs"
                        style={{ backgroundColor: activePreviewOption.colorPalette.primaryHex }}
                      />
                      <span>Primary: <code className="text-[10px]">{activePreviewOption.colorPalette.primaryHex}</code></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border shadow-xs"
                        style={{ backgroundColor: activePreviewOption.colorPalette.secondaryHex }}
                      />
                      <span>Secondary: <code className="text-[10px]">{activePreviewOption.colorPalette.secondaryHex}</code></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border shadow-xs"
                        style={{ backgroundColor: activePreviewOption.colorPalette.backgroundHex }}
                      />
                      <span>Background: <code className="text-[10px]">{activePreviewOption.colorPalette.backgroundHex}</code></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border shadow-xs"
                        style={{ backgroundColor: activePreviewOption.colorPalette.mutedHex }}
                      />
                      <span>Muted: <code className="text-[10px]">{activePreviewOption.colorPalette.mutedHex}</code></span>
                    </div>
                  </div>
                </div>

                {/* Sample Sites in KB */}
                <div>
                  <h4 className="font-bold text-xs uppercase text-muted-foreground tracking-wider mb-2">Sample Ingested References</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activePreviewOption.sampleSites.map((site, sIdx) => (
                      <Badge key={sIdx} variant="outline" className="text-xs font-condensed bg-background">
                        {site}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
