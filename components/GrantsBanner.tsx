'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useIntl } from "react-intl";

export function GrantsBanner() {
  const intl = useIntl();

  return (
    <section className="bg-card py-16 sm:py-20 border-b border-border/60">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-muted text-foreground/90 border border-border text-xs font-condensed font-semibold tracking-wider uppercase">
          <BadgeCheck className="h-3.5 w-3.5 text-primary" />
          {intl.formatMessage({ id: "grants.bannerBadge" })}
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
          {intl.formatMessage({ id: "grants.bannerTitle" })}
        </h2>
        <p className="font-sans text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
          {intl.formatMessage({ id: "grants.bannerDesc" })}
        </p>
        <div className="pt-3">
          <Button asChild size="lg" className="rounded-md font-condensed font-semibold px-7 h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs">
            <Link href="/digital-grants">
              {intl.formatMessage({ id: "grants.bannerBtn" })}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
