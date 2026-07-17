import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative pt-8 pb-20 lg:pt-16 lg:pb-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8 z-10">
          <div className="flex flex-col">
            <h1 className="font-serif text-5xl md:text-7xl leading-tight text-primary">
              Daniel Callaghan <span className="text-secondary block">小牛 / xiǎo niú</span>
            </h1>
          </div>
          <p className="font-condensed font-light text-xl text-foreground leading-relaxed max-w-lg">
            Writing about <strong>music</strong>, <strong>games</strong>, <strong>software &amp; AI</strong>. Building things for the web. Based in Ireland, formerly Beijing.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-md px-8 h-12 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90">
              <Link href="/web">
                Web Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="rounded-md px-8 h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link href="/contact">
                Contact
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-xl mx-auto lg:mx-0">
          <div className="absolute -inset-10 bg-secondary/10 blur-3xl rounded-full opacity-50" />
          <div className="absolute top-[-10%] right-[-5%] w-[80%] opacity-[0.03] -rotate-12 pointer-events-none">
            <Image
              src="/niu-zi.webp"
              alt=""
              width={400}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <div className="relative">
            <Image
              src="/niu.webp"
              alt="Niu"
              width={600}
              height={357}
              priority
              className="w-full h-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
