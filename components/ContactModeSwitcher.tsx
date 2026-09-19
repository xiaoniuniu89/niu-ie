"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FormattedMessage } from "react-intl";
import { ContactForm } from "@/components/ContactForm";
import { WebsiteSampleWizard } from "@/components/WebsiteSampleWizard";
import { MessageSquare, Sparkles } from "lucide-react";

function ContactModeSwitcherContent() {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const modeParam = searchParams.get("mode") || searchParams.get("tab");

  const [activeMode, setActiveMode] = useState<"inquiry" | "sample">(
    modeParam === "sample" || modeParam === "wizard" ? "sample" : "inquiry"
  );

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
      <div className="flex flex-col sm:flex-row p-1 bg-muted/60 rounded-lg border border-border gap-1 max-w-xl mx-auto shadow-xs">
        <button
          type="button"
          onClick={() => setActiveMode("inquiry")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-condensed font-semibold text-sm transition-all duration-150 ${
            activeMode === "inquiry"
              ? "bg-card text-foreground shadow-xs ring-1 ring-border font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-card/40"
          }`}
        >
          <MessageSquare className={`w-4 h-4 ${activeMode === "inquiry" ? "text-primary" : ""}`} />
          <span><FormattedMessage id="contact.tab.inquiry" /></span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("sample")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-condensed font-semibold text-sm transition-all duration-150 ${
            activeMode === "sample"
              ? "bg-card text-foreground shadow-xs ring-1 ring-border font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-card/40"
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeMode === "sample" ? "text-secondary" : ""}`} />
          <span><FormattedMessage id="contact.tab.sample" /></span>
        </button>
      </div>

      {/* Dynamic Subhead Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-foreground/80 font-sans text-base sm:text-lg leading-relaxed">
          {activeMode === "sample" ? (
            <FormattedMessage id="contact.tab.sampleSub" />
          ) : (
            <FormattedMessage id="contact.tab.inquirySub" />
          )}
        </p>
      </div>

      {/* Render Selected View */}
      <div className="transition-opacity duration-200">
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
