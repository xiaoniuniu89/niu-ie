'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useIntl } from "react-intl";

export function GrantsBanner() {
  const intl = useIntl();

  return (
    <section className="bg-primary/5 py-16 border-y border-primary/10">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-condensed font-semibold">
          <BadgeCheck className="h-4 w-4" />
          {intl.formatMessage({ id: "grants.bannerBadge" })}
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-primary">
          {intl.formatMessage({ id: "grants.bannerTitle" })}
        </h2>
        <p className="font-condensed font-light text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
          {intl.formatMessage({ id: "grants.bannerDesc" })}
        </p>
        <div className="pt-2">
          <Button asChild size="lg" className="rounded-md font-condensed px-8">
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
