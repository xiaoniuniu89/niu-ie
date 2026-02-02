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
} from "@/components/ui/sheet";
import { ChevronDown, Menu } from "lucide-react";

const imgImageNiuLogo = "/niu-zi.webp";

export function Header() {
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
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center text-foreground hover:text-primary transition-colors focus:outline-none p-1">
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/#about" className="font-condensed cursor-pointer">Our Core Values</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#services" className="font-condensed cursor-pointer">Services</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#faq" className="font-condensed cursor-pointer">FAQ</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link href="/portfolio" className="font-condensed font-medium text-sm text-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>

          <Button asChild className="font-condensed font-medium text-sm rounded-md px-6 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/contact">Contact</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-12">
                <Link href="/" className="font-condensed font-medium text-lg text-foreground hover:text-primary">
                  Home
                </Link>
                <div className="flex flex-col gap-4 pl-4 border-l border-foreground/10">
                  <Link href="/#about" className="font-condensed text-base text-foreground/80 hover:text-primary">
                    Our Core Values
                  </Link>
                  <Link href="/#services" className="font-condensed text-base text-foreground/80 hover:text-primary">
                    Services
                  </Link>
                  <Link href="/#faq" className="font-condensed text-base text-foreground/80 hover:text-primary">
                    FAQ
                  </Link>
                </div>
                <Link href="/portfolio" className="font-condensed font-medium text-lg text-foreground hover:text-primary">
                  Portfolio
                </Link>
                <Button asChild className="w-full font-condensed font-medium text-lg mt-4">
                  <Link href="/contact">Contact</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
