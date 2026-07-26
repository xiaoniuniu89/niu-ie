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
      <main className="flex-1 container mx-auto px-4 md:px-8 py-16 flex flex-col items-center">
        <h1 className="font-serif text-4xl sm:text-5xl text-primary mb-4 text-center">
          {intl.formatMessage({ id: "contact.title" })}
        </h1>
        <p className="font-condensed font-light text-muted-foreground text-lg sm:text-xl max-w-lg mb-8 text-center">
          {intl.formatMessage({ id: "contact.sub" })}
        </p>

        <h2 className="sr-only">Contact Form Options</h2>
        <ContactModeSwitcher />
      </main>

      <Footer showCTA={false} />
    </div>
  );
}
