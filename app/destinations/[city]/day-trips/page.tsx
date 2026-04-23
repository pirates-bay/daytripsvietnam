import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TripCard } from "@/components/content/TripCard";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, buildGraph, orgNode } from "@/lib/schema";
import { getDayTripsByCity } from "@/lib/content";
import { CITIES, CITY_SLUGS, isCitySlug } from "@/lib/entities";

interface Params {
  city: string;
}

export function generateStaticParams(): Params[] {
  return CITY_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { city } = await params;
  if (!isCitySlug(city)) return {};
  const c = CITIES[city];
  return buildMetadata({
    title: `Day Trips from ${c.name} — Every Option Ranked`,
    description: `All the best day trips you can take from ${c.name}, Vietnam — with distances, durations, how to book, and what they actually cost in 2026.`,
    path: `/destinations/${city}/day-trips/`,
  });
}

export default async function DayTripsList({ params }: { params: Promise<Params> }) {
  const { city } = await params;
  if (!isCitySlug(city)) notFound();
  const c = CITIES[city];
  const trips = getDayTripsByCity(city);

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations/" },
    { name: c.name, url: `/destinations/${city}/` },
    { name: "Day Trips", url: `/destinations/${city}/day-trips/` },
  ];

  return (
    <>
      <JsonLd data={buildGraph([orgNode(), breadcrumbNode(crumbs)])} />
      <Container size="wide" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">Day Trips from {c.name}</h1>
        <p data-speakable className="mt-3 max-w-2xl text-lg text-slate-700">
          Every worthwhile day trip you can take from {c.name}, with honest notes on what's worth the travel
          time and what's a tourist trap. Durations are door-to-door from central {c.name}.
        </p>
        {trips.length === 0 ? (
          <p className="mt-8 text-slate-600">Guides coming soon.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((t) => (
              <TripCard
                key={t.frontmatter.slug}
                href={`/destinations/${city}/day-trips/${t.frontmatter.slug}/`}
                title={t.frontmatter.title}
                blurb={t.frontmatter.description}
                image={t.frontmatter.heroImage}
                imageAlt={t.frontmatter.heroAlt}
                duration={t.frontmatter.duration?.replace("PT", "").toLowerCase()}
                priceFrom={t.frontmatter.priceFrom}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
