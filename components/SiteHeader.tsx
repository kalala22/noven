import Image from "next/image";
import { PHONE } from "@/lib/simulator/data";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label="NOVEN — accueil">
          <Image
            src="/noven-logo.png"
            alt="NOVEN"
            width={1345}
            height={336}
            priority
            className="h-6 w-auto sm:h-7"
          />
          <span className="h-5 w-px bg-line" aria-hidden />
          <span className="truncate text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted sm:text-xs">
            EcoFlow
          </span>
        </a>

        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="#simulateur"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-ink md:inline-flex"
          >
            Simulateur
          </a>
          <a
            href="#gamme"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-ink md:inline-flex"
          >
            Gamme
          </a>
          <a
            href={`https://wa.me/${PHONE}`}
            target="_blank"
            rel="noopener"
            className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-semibold text-paper transition-colors hover:bg-anth sm:px-5"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
