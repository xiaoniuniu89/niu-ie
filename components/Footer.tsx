import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <ul className="flex flex-wrap gap-x-8 gap-y-2 font-condensed font-light text-sm text-white/70 justify-center md:justify-start">
            <li><Link href="/music" className="hover:text-white transition-colors">Music</Link></li>
            <li><Link href="/games" className="hover:text-white transition-colors">Games</Link></li>
            <li><Link href="/software" className="hover:text-white transition-colors">Software</Link></li>
            <li><Link href="/web" className="hover:text-white transition-colors">Web</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div className="pt-6 border-t border-white/20 text-center md:text-left">
          <p className="font-condensed font-light text-sm text-white/50">
            &copy; {new Date().getFullYear()} Daniel Callaghan
          </p>
        </div>
      </div>
    </footer>
  );
}
