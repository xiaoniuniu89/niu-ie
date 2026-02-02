import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Expertise } from "@/components/Expertise";
import { Philosophy } from "@/components/Philosophy";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

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
      <FAQ />
      <Footer />
    </main>
  );
}
