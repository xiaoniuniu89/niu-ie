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
    <footer className="bg-foreground/5 text-foreground pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        {showCTA && (
          <div className="bg-accent text-accent-foreground rounded-2xl p-10 md:p-16 text-center mb-16 space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl text-white">
              Ready to upgrade your web presence?
            </h2>
            <p className="font-condensed font-light text-lg text-white/80 max-w-lg mx-auto leading-relaxed">
              Let&apos;s build something remarkable together. Contact us today for a free consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md px-8 h-10 font-condensed font-medium">
                <Link href="/contact">{intl.formatMessage({ id: "nav.contact" })}</Link>
              </Button>
            </div>
          </div>
        )}
        
        <div className="mb-12 border-t border-foreground/20 pt-12 text-accent">
          <h4 className="font-serif text-lg mb-4 text-center md:text-left">Sitemap</h4>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 font-condensed font-light text-sm text-accent/70 justify-center md:justify-start">
            <li><Link href="/#about" className="hover:text-accent transition-colors">{intl.formatMessage({ id: "nav.values" })}</Link></li>
            <li><Link href="/#services" className="hover:text-accent transition-colors">{intl.formatMessage({ id: "nav.services" })}</Link></li>
            <li><Link href="/#faq" className="hover:text-accent transition-colors">{intl.formatMessage({ id: "nav.faq" })}</Link></li>
            <li><Link href="/portfolio" className="hover:text-accent transition-colors">{intl.formatMessage({ id: "nav.portfolio" })}</Link></li>
            <li><Link href="/digital-grants" className="hover:text-accent transition-colors">{intl.formatMessage({ id: "nav.grants" })}</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors">{intl.formatMessage({ id: "nav.contact" })}</Link></li>
          </ul>
        </div>
        <div className="pt-8 border-t border-foreground/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-foreground/60 text-xs font-condensed">&copy; {new Date().getFullYear()} Niu Web. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
