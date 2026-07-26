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
import { ChevronDown, Menu, Sparkles, MessageSquare } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useIntl } from "react-intl";

const imgImageNiuLogo = "/niu-zi.webp";

export function Header() {
  const intl = useIntl();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-foreground/5">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image 
            src={imgImageNiuLogo} 
            alt="Niu Logo" 
            width={40}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1">
            <Link href="/" className="font-condensed font-medium text-sm text-foreground hover:text-primary transition-colors">
              {intl.formatMessage({ id: "nav.home" })}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Open sub-navigation for Home page" className="flex items-center justify-center text-foreground hover:text-primary transition-colors focus:outline-none p-1 cursor-pointer">
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/#about" className="font-condensed cursor-pointer">{intl.formatMessage({ id: "nav.values" })}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#services" className="font-condensed cursor-pointer">{intl.formatMessage({ id: "nav.services" })}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#faq" className="font-condensed cursor-pointer">{intl.formatMessage({ id: "nav.faq" })}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link href="/process" className="font-condensed font-medium text-sm text-foreground hover:text-primary transition-colors">
            {intl.formatMessage({ id: "nav.process" })}
          </Link>

          <Link href="/digital-grants" className="font-condensed font-medium text-sm text-foreground hover:text-primary transition-colors">
            {intl.formatMessage({ id: "nav.grants" })}
          </Link>

          <Link href="/portfolio" className="font-condensed font-medium text-sm text-foreground hover:text-primary transition-colors">
            {intl.formatMessage({ id: "nav.portfolio" })}
          </Link>

          {/* Contact Nav Item & Dropdown (Identical to Home Nav item) */}
          <div className="flex items-center gap-1">
            <Link href="/contact" className="font-condensed font-medium text-sm text-foreground hover:text-primary transition-colors">
              {intl.formatMessage({ id: "nav.contact" })}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Open sub-navigation for Contact options" className="flex items-center justify-center text-foreground hover:text-primary transition-colors focus:outline-none p-1 cursor-pointer">
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 space-y-1">
                <DropdownMenuItem asChild>
                  <Link href="/contact?mode=sample" className="font-condensed cursor-pointer flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm font-medium">
                    <Sparkles className="w-4 h-4 text-secondary shrink-0" />
                    <span>Request Free Website Sample</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact?mode=inquiry" className="font-condensed cursor-pointer flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm font-medium">
                    <MessageSquare className="w-4 h-4 text-primary shrink-0" />
                    <span>General Inquiry</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <LanguageSelector />
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle navigation menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="flex flex-col gap-6 mt-12">
                <Link href="/" className="font-condensed font-medium text-lg text-foreground hover:text-primary">
                  {intl.formatMessage({ id: "nav.home" })}
                </Link>
                <div className="flex flex-col gap-4 pl-4 border-l border-foreground/10">
                  <Link href="/#about" className="font-condensed text-base text-foreground/80 hover:text-primary">
                    {intl.formatMessage({ id: "nav.values" })}
                  </Link>
                  <Link href="/#services" className="font-condensed text-base text-foreground/80 hover:text-primary">
                    {intl.formatMessage({ id: "nav.services" })}
                  </Link>
                  <Link href="/#faq" className="font-condensed text-base text-foreground/80 hover:text-primary">
                    {intl.formatMessage({ id: "nav.faq" })}
                  </Link>
                </div>
                <Link href="/process" className="font-condensed font-medium text-lg text-foreground hover:text-primary">
                  {intl.formatMessage({ id: "nav.process" })}
                </Link>
                <Link href="/digital-grants" className="font-condensed font-medium text-lg text-foreground hover:text-primary">
                  {intl.formatMessage({ id: "nav.grants" })}
                </Link>
                <Link href="/portfolio" className="font-condensed font-medium text-lg text-foreground hover:text-primary">
                  {intl.formatMessage({ id: "nav.portfolio" })}
                </Link>

                <div className="pt-4 border-t space-y-2">
                  <span className="text-xs font-condensed uppercase tracking-wider text-muted-foreground font-semibold px-1">Contact Options</span>
                  <Link href="/contact?mode=sample" className="flex items-center gap-2 font-condensed font-medium text-base text-foreground hover:text-primary pl-2 py-1">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <span>Request Free Website Sample</span>
                  </Link>
                  <Link href="/contact?mode=inquiry" className="flex items-center gap-2 font-condensed font-medium text-base text-foreground hover:text-primary pl-2 py-1">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>General Inquiry</span>
                  </Link>
                </div>

                <div className="mt-2">
                  <LanguageSelector />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
