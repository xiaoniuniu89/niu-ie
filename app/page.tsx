import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Expertise } from "@/components/Expertise";
import { Philosophy } from "@/components/Philosophy";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Niu Web",
    "image": "https://www.niu.ie/niu.webp",
    "@id": "https://www.niu.ie",
    "url": "https://www.niu.ie",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Westmeath",
      "addressRegion": "Leinster",
      "addressCountry": "IE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 53.5345,
      "longitude": -7.3392
    }, 
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Hero />
      <Philosophy />
      <Expertise />
      
      {/* LEO Grants Funding Callout */}
      <section className="bg-primary/5 py-16 border-y border-primary/10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-condensed font-semibold">
            <BadgeCheck className="h-4 w-4" />
            Government Funding Available
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-primary">
            Get Up to 50% Funding for Your Web Project
          </h2>
          <p className="font-condensed font-light text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Did you know your business might qualify for the LEO Trading Online Voucher (€2,500) or the Grow Digital Voucher (€5,000) to help cover custom design and development costs?
          </p>
          <div className="pt-2">
            <Button asChild size="lg" className="rounded-md font-condensed px-8">
              <Link href="/digital-grants">
                View Grants &amp; Funding Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <FAQ />
      <Footer />
    </main>
  );
}
