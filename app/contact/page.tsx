'use client';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { useIntl } from "react-intl";

export default function Contact() {
  const intl = useIntl();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-8 py-20 flex flex-col items-center">
        <h1 className="font-serif text-5xl text-primary mb-6 text-center">{intl.formatMessage({ id: "contact.title" })}</h1>
        <p className="font-condensed font-light text-foreground text-xl max-w-lg mb-12 text-center">
          {intl.formatMessage({ id: "contact.sub" })}
        </p>

        <ContactForm />
      </main>

      <Footer showCTA={false} />
    </div>
  );
}



