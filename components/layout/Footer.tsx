import Link from "next/link";
import { Container } from "./Container";
import { SITE } from "@/lib/site";
import { CITIES } from "@/lib/entities";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 py-10 text-sm text-slate-600">
      <Container size="wide">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="font-serif text-lg font-semibold text-slate-900">{SITE.name}</p>
            <p className="mt-2 max-w-xs text-slate-600">{SITE.description}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Destinations</p>
            <ul className="mt-3 space-y-1.5">
              {Object.values(CITIES).map((c) => (
                <li key={c.slug}>
                  <Link href={`/destinations/${c.slug}/`} className="hover:text-brand-700">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Plan</p>
            <ul className="mt-3 space-y-1.5">
              <li><Link href="/itineraries/" className="hover:text-brand-700">Itineraries</Link></li>
              <li><Link href="/guides/" className="hover:text-brand-700">Guides</Link></li>
              <li><Link href="/guides/best-time-to-visit-vietnam/" className="hover:text-brand-700">Best time to visit</Link></li>
              <li><Link href="/guides/vietnam-visa/" className="hover:text-brand-700">Visa</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Site</p>
            <ul className="mt-3 space-y-1.5">
              <li><Link href="/about/" className="hover:text-brand-700">About</Link></li>
              <li><Link href="/press/" className="hover:text-brand-700">Press</Link></li>
              <li><Link href="/contact/" className="hover:text-brand-700">Contact</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-brand-700">Sitemap</Link></li>
              <li><Link href="/rss.xml" className="hover:text-brand-700">RSS</Link></li>
              <li><Link href="/llms.txt" className="hover:text-brand-700">llms.txt</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {year} {SITE.name}. Independent travel guides. Not affiliated with any tour operator.
          </p>
          <ul className="flex gap-4 text-xs">
            {SITE.social.map((url) => {
              const host = new URL(url).hostname.replace(/^www\./, "");
              const label = host.split(".")[0];
              return (
                <li key={url}>
                  <a
                    href={url}
                    rel="me noopener"
                    target="_blank"
                    className="capitalize text-slate-500 hover:text-brand-700"
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
