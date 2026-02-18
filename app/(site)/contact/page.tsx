import { ContactForm } from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Daniel Callaghan.",
};

export default function Contact() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-20 flex flex-col items-center">
      <h1 className="font-serif text-5xl text-primary mb-6 text-center">Contact</h1>
      <p className="font-condensed font-light text-foreground text-xl max-w-lg mb-12 text-center">
        Have a question or want to work together? Drop me a message.
      </p>
      <ContactForm />
    </div>
  );
}
