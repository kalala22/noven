import Image from "next/image";
import { CONTACT, PHONE } from "@/lib/simulator/data";

const links = [
  { href: CONTACT.site, label: "noven.cd" },
  { href: CONTACT.instagram, label: "Instagram @novencd" },
  { href: CONTACT.facebook, label: "Facebook @novencd" },
  { href: `mailto:${CONTACT.email}`, label: CONTACT.email },
  { href: `tel:+${PHONE}`, label: CONTACT.phoneDisplay },
];

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Image
              src="/noven-logo.png"
              alt="NOVEN"
              width={1345}
              height={336}
              className="h-8 w-auto invert"
            />
            <p className="mt-4 text-sm text-white/60">Revendeur EcoFlow · {CONTACT.city}</p>
          </div>
          <ul className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener"
                  className="font-medium text-white/80 transition-colors hover:text-orange"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/45">
          Estimations indicatives. Si le besoin dépasse les configurations couvertes, le simulateur
          vous oriente vers NOVEN pour un dimensionnement personnalisé.
        </p>
      </div>
    </footer>
  );
}
