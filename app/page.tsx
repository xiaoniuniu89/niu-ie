import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Expertise } from "@/components/Expertise";
import { Philosophy } from "@/components/Philosophy";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Philosophy />
      <Expertise />
      <FAQ />
      <Footer />
    </main>
  );
}
