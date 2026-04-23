import Link from "next/link";
import { Container } from "./Container";

const NAV = [
  { href: "/destinations/", label: "Destinations" },
  { href: "/itineraries/", label: "Itineraries" },
  { href: "/guides/", label: "Guides" },
  { href: "/about/", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
      <Container size="wide">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-xl font-semibold text-slate-900">
            Day Trips <span className="text-brand-700">Vietnam</span>
          </Link>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm font-medium text-slate-700">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand-700">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
}
