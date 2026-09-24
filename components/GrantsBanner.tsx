'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useIntl } from "react-intl";

export function GrantsBanner() {
  const intl = useIntl();

  return (
    <section className="bg-primary/[0.05] py-16 sm:py-20 border-y border-primary/15">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-5xl text-primary tracking-tight">
          {intl.formatMessage({ id: "grants.bannerTitle" })}
        </h2>
        <p className="font-sans text-base sm:text-lg text-foreground/85 max-w-2xl mx-auto leading-relaxed">
          {intl.formatMessage({ id: "grants.bannerDesc" })}
        </p>
        <div className="pt-2">
          <Button asChild size="lg" className="rounded-md font-condensed font-bold text-base px-8 h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md">
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
