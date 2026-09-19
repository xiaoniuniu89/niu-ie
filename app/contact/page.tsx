'use client';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactModeSwitcher } from "@/components/ContactModeSwitcher";
import Script from "next/script";
import { useIntl } from "react-intl";

export default function Contact() {
  const intl = useIntl();

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": intl.formatMessage({ id: "contact.title" }),
    "description": intl.formatMessage({ id: "contact.sub" }),
    "url": "https://www.niu.ie/contact",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Script id="contact-schema" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(contactSchema)}
      </Script>
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-8 py-14 md:py-20 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-muted text-muted-foreground text-xs font-condensed font-semibold tracking-wider uppercase border border-border mb-3">
          Get In Touch
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-3 text-center tracking-tight">
          {intl.formatMessage({ id: "contact.title" })}
        </h1>
        <p className="font-sans text-base sm:text-lg text-foreground/80 max-w-lg mb-10 text-center leading-relaxed">
          {intl.formatMessage({ id: "contact.sub" })}
        </p>

        <h2 className="sr-only">Contact Form Options</h2>
        <ContactModeSwitcher />
      </main>

      <Footer showCTA={false} />
    </div>
  );
}
