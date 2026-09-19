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
          <div className="bg-card border border-border rounded-lg p-8 sm:p-12 text-center mb-16 shadow-xs max-w-3xl mx-auto space-y-5">
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
              Ready to upgrade your web presence?
            </h2>
            <p className="font-sans text-base sm:text-lg text-foreground/80 max-w-lg mx-auto leading-relaxed">
              Let&apos;s build something remarkable together. Contact us today for a free consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-7 h-11 font-condensed font-semibold shadow-xs">
                <Link href="/contact?mode=sample">Request Free Website Sample</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-md px-6 h-11 font-condensed font-semibold">
                <Link href="/contact?mode=inquiry">General Inquiry</Link>
              </Button>
            </div>
          </div>
        )}
        
        <div className="border-t border-border pt-10">
          <h4 className="font-condensed font-semibold uppercase tracking-wider text-xs text-muted-foreground mb-4 text-center md:text-left">
            Sitemap
          </h4>
          <ul className="flex flex-wrap gap-x-8 gap-y-2.5 font-condensed font-medium text-sm text-muted-foreground justify-center md:justify-start">
            <li><Link href="/#about" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.values" })}</Link></li>
            <li><Link href="/#services" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.services" })}</Link></li>
            <li><Link href="/process" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.process" })}</Link></li>
            <li><Link href="/digital-grants" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.grants" })}</Link></li>
            <li><Link href="/#faq" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.faq" })}</Link></li>
            <li><Link href="/portfolio" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.portfolio" })}</Link></li>
            <li><Link href="/contact?mode=sample" className="hover:text-primary transition-colors">Website Sample Wizard</Link></li>
            <li><Link href="/contact?mode=inquiry" className="hover:text-primary transition-colors">{intl.formatMessage({ id: "nav.contact" })}</Link></li>
          </ul>
        </div>
        <div className="pt-8 mt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-condensed text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Niu Web. Co. Westmeath, Ireland. All rights reserved.</p>
          <p>Built for cognitive accessibility and fast local performance.</p>
        </div>
      </div>
    </footer>
  );
}
