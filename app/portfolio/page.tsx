import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Local portfolio images
const imgBellaRose = "/bellarosebright.webp";
const imgCCPiano = "/ccpiano.webp";

const portfolioItems = [
  {
    category: "Author & Publishing",
    title: "Bella Rose Bright",
    description: "A playful, engaging website for a Co. Westmeath author. We implemented a custom visual editor, giving her full ownership to update themes seasonally and manage content with zero technical knowledge.",
    image: imgBellaRose,
    link: "https://www.bellarosebright.com/",
  },
  {
    category: "Education & Arts",
    title: "CC Piano",
    description: "A multilingual platform for a Midlands-based piano teacher. Integrated with an AI assistant to handle FAQs, email/whatsapp correspondence, and automated scheduling based on real-time availability.",
    image: imgCCPiano,
    link: "https://www.ccpiano.ie",
  },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-8 py-20">
          <div className="mb-16">
            <h1 className="font-serif text-5xl text-primary mb-6">Our Portfolio</h1>
            <p className="font-condensed font-light text-xl text-foreground/80 max-w-3xl leading-relaxed">
              We take pride in helping local businesses shine online. Here are a few examples of how we&apos;ve helped professionals like you establish a strong digital footing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {portfolioItems.map((item, index) => (
              <Card key={index} className="group overflow-hidden border-border/50 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <CardHeader className="space-y-4">
                  <div className="text-secondary font-condensed font-medium text-sm tracking-wider uppercase">
                    {item.category}
                  </div>
                  <CardTitle className="font-sans font-bold text-2xl text-foreground">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="font-condensed font-light text-base text-foreground/80 leading-relaxed min-h-[4.5rem]">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 p-0 font-condensed font-medium">
                    <Link
                      href={item.link}
                      target={item.link.startsWith("http") ? "_blank" : undefined}
                      rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2"
                    >
                      {item.link.startsWith("http") ? "Visit Website" : "View Case Study"} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="bg-accent/10 rounded-3xl p-12 text-center max-w-4xl mx-auto mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">
              Ready to be our next success story?
            </h2>
            <p className="font-condensed font-light text-lg text-foreground/80 mb-8 max-w-lg mx-auto">
              Let&apos;s build a website that works as hard as you do.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-condensed px-8">
              <Link href="/contact">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
