"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChevronDown, Menu, Sparkles, MessageSquare, LogIn } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useIntl } from "react-intl";

const imgImageNiuLogo = "/niu-zi.webp";

export function Header() {
  const intl = useIntl();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border/80">
      <div className="container mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded p-1"
          aria-label="Niu Web - Return to Home"
        >
          <Image 
            src={imgImageNiuLogo} 
            alt="Niu Logo" 
            width={38}
            height={38}
            className="h-9 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          <Link 
            href="/#pricing" 
            className="font-condensed font-semibold text-sm tracking-wide text-foreground/85 hover:text-primary transition-colors py-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            {intl.formatMessage({ id: "nav.pricing" })}
          </Link>
          <Link 
            href="/#services" 
            className="font-condensed font-semibold text-sm tracking-wide text-foreground/85 hover:text-primary transition-colors py-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            {intl.formatMessage({ id: "nav.services" })}
          </Link>
          <Link 
            href="/process" 
            className="font-condensed font-semibold text-sm tracking-wide text-foreground/85 hover:text-primary transition-colors py-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            {intl.formatMessage({ id: "nav.process" })}
          </Link>
          <Link 
            href="/digital-grants" 
            className="font-condensed font-semibold text-sm tracking-wide text-foreground/85 hover:text-primary transition-colors py-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            {intl.formatMessage({ id: "nav.grants" })}
          </Link>
          <Link 
            href="/portfolio" 
            className="font-condensed font-semibold text-sm tracking-wide text-foreground/85 hover:text-primary transition-colors py-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            {intl.formatMessage({ id: "nav.portfolio" })}
          </Link>
          <Link 
            href="/contact" 
            className="font-condensed font-semibold text-sm tracking-wide text-foreground/85 hover:text-primary transition-colors py-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            {intl.formatMessage({ id: "nav.contact" })}
          </Link>

          <div className="h-4 w-px bg-border mx-1" aria-hidden="true" />

          <LanguageSelector />

          <Button asChild variant="outline" size="sm" className="font-condensed font-semibold tracking-wide rounded-md">
            <Link href="/portal">
              <LogIn className="w-3.5 h-3.5" />
              {intl.formatMessage({ id: "nav.clientLogin" })}
            </Link>
          </Button>

          <Button asChild size="sm" className="font-condensed font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
            <Link href="/contact?mode=sample">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-secondary" />
              {intl.formatMessage({ id: "header.cta" })}
            </Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-3">
          <LanguageSelector />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] bg-background p-6 flex flex-col justify-between">
              <div>
                <SheetTitle className="font-serif text-xl text-primary mb-6">Navigation</SheetTitle>
                <nav className="flex flex-col gap-4">
                  <Link 
                    href="/#pricing" 
                    className="font-condensed font-semibold text-lg text-foreground hover:text-primary transition-colors py-1.5 border-b border-border/50"
                  >
                    {intl.formatMessage({ id: "nav.pricing" })}
                  </Link>
                  <Link 
                    href="/#services" 
                    className="font-condensed font-semibold text-lg text-foreground hover:text-primary transition-colors py-1.5 border-b border-border/50"
                  >
                    {intl.formatMessage({ id: "nav.services" })}
                  </Link>
                  <Link 
                    href="/process" 
                    className="font-condensed font-semibold text-lg text-foreground hover:text-primary transition-colors py-1.5 border-b border-border/50"
                  >
                    {intl.formatMessage({ id: "nav.process" })}
                  </Link>
                  <Link 
                    href="/digital-grants" 
                    className="font-condensed font-semibold text-lg text-foreground hover:text-primary transition-colors py-1.5 border-b border-border/50"
                  >
                    {intl.formatMessage({ id: "nav.grants" })}
                  </Link>
                  <Link 
                    href="/portfolio" 
                    className="font-condensed font-semibold text-lg text-foreground hover:text-primary transition-colors py-1.5 border-b border-border/50"
                  >
                    {intl.formatMessage({ id: "nav.portfolio" })}
                  </Link>
                  <Link 
                    href="/contact" 
                    className="font-condensed font-semibold text-lg text-foreground hover:text-primary transition-colors py-1.5 border-b border-border/50"
                  >
                    {intl.formatMessage({ id: "nav.contact" })}
                  </Link>
                </nav>
              </div>

              <div className="pt-6 border-t border-border flex flex-col gap-3">
                <Button asChild className="w-full font-condensed font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                  <Link href="/contact?mode=sample">
                    <Sparkles className="w-4 h-4 mr-2 text-secondary" />
                    {intl.formatMessage({ id: "hero.startProject" })}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full font-condensed font-semibold rounded-md">
                  <Link href="/contact?mode=inquiry">
                    {intl.formatMessage({ id: "footer.inquiryBtn" })}
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full font-condensed font-semibold rounded-md">
                  <Link href="/portal">
                    <LogIn className="w-4 h-4 mr-2" />
                    {intl.formatMessage({ id: "nav.clientLogin" })}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
