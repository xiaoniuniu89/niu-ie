'use client';

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
import { ChevronDown, Menu } from "lucide-react";
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
              <DropdownMenuTrigger aria-label="Open sub-navigation for Home page" className="flex items-center justify-center text-foreground hover:text-primary transition-colors focus:outline-none p-1">
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

          <LanguageSelector />

          <Button asChild variant="outline" className="font-condensed font-medium text-sm rounded-md px-4 border-primary/30 text-primary hover:bg-primary/10">
            <Link href="/contact?mode=sample">Request Sample</Link>
          </Button>
          <Button asChild className="font-condensed font-medium text-sm rounded-md px-5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/contact?mode=inquiry">{intl.formatMessage({ id: "nav.contact" })}</Link>
          </Button>
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
                <Button asChild className="w-full font-condensed font-semibold text-base mt-4 bg-primary text-primary-foreground">
                  <Link href="/contact?mode=sample">Request Free Website Sample</Link>
                </Button>
                <Button asChild variant="outline" className="w-full font-condensed font-medium text-base mt-2">
                  <Link href="/contact?mode=inquiry">{intl.formatMessage({ id: "nav.contact" })}</Link>
                </Button>
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
