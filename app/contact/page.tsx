import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Start Your Web Project",
  description: "Get in touch with Niu Web to discuss your website design, local SEO, or LEO digital grant application.",
};

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-8 py-20 flex flex-col items-center">
        <h1 className="font-serif text-5xl text-primary mb-6 text-center">Contact Us</h1>
        <p className="font-condensed font-light text-foreground text-xl max-w-lg mb-12 text-center">
          We&apos;re ready to start your project. Fill out the form below and we&apos;ll get back to you as soon as possible.
        </p>

        <ContactForm />

      </main>

      <Footer showCTA={false} />

    </div>

  );

}



