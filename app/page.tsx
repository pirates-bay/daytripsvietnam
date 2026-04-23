import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Hero } from "@/components/content/Hero";
import { TripCard } from "@/components/content/TripCard";
import { Faq } from "@/components/content/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildGraph, faqNode, orgNode, websiteNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { CITIES } from "@/lib/entities";
import { getByType } from "@/lib/content";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: `${SITE.name} — The Best Day Trips, Tours & Itineraries in Vietnam`,
  description:
    "Independent guides to the best day trips from Hanoi, Ninh Binh, Ha Long Bay, Sapa, Hoi An, Da Nang, Hue, and Ho Chi Minh City — plus full Vietnam itineraries.",
  path: "/",
});

const HOMEPAGE_FAQ = [
  {
    q: "What are the best day trips in Vietnam?",
    a: "Ninh Binh and Ha Long Bay from Hanoi, the Marble Mountains and Hoi An from Da Nang, the Cu Chi Tunnels and Mekong Delta from Ho Chi Minh City, and the Hai Van Pass between Hue and Hoi An are the most-loved day trips in Vietnam.",
  },
  {
    q: "How many days do you need in Vietnam?",
    a: "Ten to fourteen days is the sweet spot to see the north (Hanoi, Ha Long, Sapa), centre (Hue, Hoi An, Da Nang), and south (Ho Chi Minh City, Mekong Delta). With one week, pick one region.",
  },
  {
    q: "Is Vietnam good for first-time travelers?",
    a: "Yes. Vietnam has well-developed tourist infrastructure, safe cities, affordable prices, and a simple north-to-south route. English is widely spoken in tourist areas.",
  },
];

export default function HomePage() {
  const featuredTrips = getByType("day-trip").slice(0, 6);
  const featuredItineraries = getByType("itinerary").slice(0, 3);

  return (
    <>
      <JsonLd
        data={buildGraph([
          orgNode(),
          websiteNode(),
          faqNode(HOMEPAGE_FAQ),
        ])}
      />
      <Container size="wide" className="py-8">
        <Hero
          eyebrow="Vietnam travel, done right"
          title="The best day trips, tours & itineraries across Vietnam"
          summary="Independent, up-to-date guides to every major Vietnamese destination. No affiliate fluff — just what's worth your time, how long it takes, what it costs, and how to book it yourself."
        />
      </Container>

      <Container size="wide" className="py-12">
        <h2 className="text-3xl font-semibold">Explore by destination</h2>
        <p className="mt-2 text-slate-600">
          Pick a city to see its best day trips, tours, and things to do.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(CITIES).map((c) => (
            <li key={c.slug}>
              <Link
                href={`/destinations/${c.slug}/`}
                className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                  {c.region} Vietnam
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{c.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{c.shortBlurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      {featuredTrips.length > 0 && (
        <Container size="wide" className="py-12">
          <h2 className="text-3xl font-semibold">Featured day trips</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTrips.map((d) => (
              <TripCard
                key={d.frontmatter.slug}
                href={`/destinations/${d.frontmatter.city}/day-trips/${d.frontmatter.slug}/`}
                title={d.frontmatter.title}
                blurb={d.frontmatter.description}
                image={d.frontmatter.heroImage}
                imageAlt={d.frontmatter.heroAlt}
                duration={d.frontmatter.duration?.replace("PT", "").toLowerCase()}
                priceFrom={d.frontmatter.priceFrom}
              />
            ))}
          </div>
        </Container>
      )}

      {featuredItineraries.length > 0 && (
        <Container size="wide" className="py-12">
          <h2 className="text-3xl font-semibold">Popular itineraries</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItineraries.map((d) => (
              <TripCard
                key={d.frontmatter.slug}
                href={`/itineraries/${d.frontmatter.slug}/`}
                title={d.frontmatter.title}
                blurb={d.frontmatter.description}
                image={d.frontmatter.heroImage}
                imageAlt={d.frontmatter.heroAlt}
                duration={`${d.frontmatter.durationDays} days`}
              />
            ))}
          </div>
        </Container>
      )}

      <Container size="prose" className="py-12">
        <Faq items={HOMEPAGE_FAQ} />
      </Container>
    </>
  );
}
