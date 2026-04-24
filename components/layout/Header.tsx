import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";

const NAV = [
  { href: "/destinations/", label: "Destinations" },
  { href: "/itineraries/", label: "Itineraries" },
  { href: "/transport/", label: "Transport" },
  { href: "/guides/", label: "Guides" },
  { href: "/about/", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
      <Container size="wide">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            aria-label="Day Trips Vietnam — home"
            className="flex items-center"
          >
            <Image
              src="/logo.png"
              alt="Day Trips Vietnam"
              width={2508}
              height={627}
              priority
              sizes="(max-width: 768px) 160px, 200px"
              className="h-9 w-auto md:h-10"
            />
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
