'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useIntl } from "react-intl";

interface FooterProps {
  showCTA?: boolean;
}

export function Footer({ showCTA = true }: FooterProps) {
  const intl = useIntl();

  return (
    <footer className="bg-muted/40 border-t border-border/80 text-foreground pt-16 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        {showCTA && (
          <div className="bg-accent text-accent-foreground rounded-2xl p-10 md:p-16 text-center mb-16 space-y-6 shadow-sm">
            <h2 className="font-serif text-3xl md:text-4xl text-white">
              {intl.formatMessage({ id: "footer.ctaTitle" })}
            </h2>
            <p className="font-sans text-base sm:text-lg text-white/85 max-w-lg mx-auto leading-relaxed">
              {intl.formatMessage({ id: "footer.ctaSub" })}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md px-8 h-12 font-condensed font-bold text-base shadow-xs">
                <Link href="/contact?mode=sample">{intl.formatMessage({ id: "footer.ctaBtn" })}</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 rounded-md px-6 h-12 font-condensed font-medium text-base">
                <Link href="/contact?mode=inquiry">{intl.formatMessage({ id: "footer.inquiryBtn" })}</Link>
              </Button>
            </div>
          </div>
        )}
        
        <div className="border-t border-border pt-10">
          <p className="font-condensed font-semibold uppercase tracking-wider text-xs text-muted-foreground mb-4 text-center md:text-left">
            {intl.formatMessage({ id: "footer.sitemap" })}
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2.5 font-condensed font-medium text-sm text-muted-foreground justify-center md:justify-start">
            <li><Link href="/#pricing" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.pricing" })}</Link></li>
            <li><Link href="/#services" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.services" })}</Link></li>
            <li><Link href="/process" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.process" })}</Link></li>
            <li><Link href="/digital-grants" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.grants" })}</Link></li>
            <li><Link href="/#faq" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.faq" })}</Link></li>
            <li><Link href="/portfolio" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.portfolio" })}</Link></li>
            <li><Link href="/contact?mode=sample" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "footer.sampleLink" })}</Link></li>
            <li><Link href="/contact?mode=inquiry" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.contact" })}</Link></li>
          </ul>
        </div>
        <div className="pt-8 mt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-condensed text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Niu Web. Co. Westmeath, Ireland. {intl.formatMessage({ id: "footer.rights" })}</p>
          <p>{intl.formatMessage({ id: "footer.tagline" })}</p>
        </div>
      </div>
    </footer>
  );
}
