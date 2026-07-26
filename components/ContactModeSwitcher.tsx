"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FormattedMessage } from "react-intl";
import { ContactForm } from "@/components/ContactForm";
import { WebsiteSampleWizard } from "@/components/WebsiteSampleWizard";
import { checkWizardAccess } from "@/app/actions/contact";
import { MessageSquare, Sparkles, Lock } from "lucide-react";

function ContactModeSwitcherContent() {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const modeParam = searchParams.get("mode") || searchParams.get("tab");

  const [activeMode, setActiveMode] = useState<"inquiry" | "sample">(
    modeParam === "sample" || modeParam === "wizard" ? "sample" : "inquiry"
  );
  const [wizardAllowed, setWizardAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    checkWizardAccess()
      .then((d) => {
        setWizardAllowed(d.allowed);
        if (!d.allowed) setActiveMode("inquiry");
      })
      .catch(() => setWizardAllowed(true));
  }, []);

  useEffect(() => {
    const currentMode = searchParams.get("mode") || searchParams.get("tab");
    if (currentMode === "sample" || currentMode === "wizard") {
      setActiveMode("sample");
    } else if (currentMode === "inquiry") {
      setActiveMode("inquiry");
    }
  }, [searchString, searchParams]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Segmented Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row p-1.5 bg-muted rounded-2xl border shadow-inner gap-1.5 max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => setActiveMode("inquiry")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-condensed font-bold text-sm sm:text-base transition-all duration-200 ${
            activeMode === "inquiry"
              ? "bg-card text-primary shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          }`}
        >
          <MessageSquare className={`w-4 h-4 ${activeMode === "inquiry" ? "text-primary" : ""}`} />
          <span><FormattedMessage id="contact.tab.inquiry" /></span>
        </button>

        {wizardAllowed !== false && (
          <button
            type="button"
            onClick={() => setActiveMode("sample")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-condensed font-bold text-sm sm:text-base transition-all duration-200 ${
              activeMode === "sample"
                ? "bg-card text-primary shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeMode === "sample" ? "text-secondary" : ""}`} />
            <span><FormattedMessage id="contact.tab.sample" /></span>
          </button>
        )}
      </div>

      {/* Dynamic Subhead Banner */}
      <div className="text-center max-w-2xl mx-auto">
        {wizardAllowed === false ? (
          <p className="text-muted-foreground font-condensed text-base sm:text-lg leading-relaxed flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
            You've already submitted a sample website request. Please use the general inquiry form below.
          </p>
        ) : (
          <p className="text-muted-foreground font-condensed text-base sm:text-lg leading-relaxed">
            {activeMode === "sample" ? (
              <FormattedMessage id="contact.tab.sampleSub" />
            ) : (
              <FormattedMessage id="contact.tab.inquirySub" />
            )}
          </p>
        )}
      </div>

      {/* Render Selected View */}
      <div className="transition-all duration-300">
        {activeMode === "sample" ? <WebsiteSampleWizard /> : <ContactForm />}
      </div>
    </div>
  );
}

export function ContactModeSwitcher() {
  return (
    <Suspense fallback={<div className="w-full max-w-4xl mx-auto bg-card p-10 rounded-2xl border text-center font-condensed text-muted-foreground">Loading inquiry options...</div>}>
      <ContactModeSwitcherContent />
    </Suspense>
  );
}
