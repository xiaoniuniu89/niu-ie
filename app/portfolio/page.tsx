import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Portfolio() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-8 py-20 flex flex-col items-center justify-center text-center">
        <h1 className="font-serif text-5xl text-primary mb-6">Portfolio</h1>
        <p className="font-condensed font-light text-foreground text-xl max-w-lg">
          We are currently curating our best work to showcase here. Please check back soon to see examples of how we help local businesses thrive online.
        </p>
      </main>
      <Footer />
    </div>
  );
}