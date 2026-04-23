import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TripCard } from "@/components/content/TripCard";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, buildGraph, orgNode } from "@/lib/schema";
import { getByType } from "@/lib/content";

export const metadata = buildMetadata({
  title: "Vietnam Itineraries — 3, 5, 10 & 14 Days",
  description:
    "Editor-built Vietnam itineraries for every trip length — covering Hanoi, Ninh Binh, Ha Long, Hoi An, Hue, Ho Chi Minh City and beyond.",
  path: "/itineraries/",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Itineraries", url: "/itineraries/" },
];

export default function ItinerariesIndex() {
  const items = getByType("itinerary").sort(
    (a, b) => a.frontmatter.durationDays - b.frontmatter.durationDays,
  );
  return (
    <>
      <JsonLd data={buildGraph([orgNode(), breadcrumbNode(crumbs)])} />
      <Container size="default" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">Vietnam Itineraries</h1>
        <p data-speakable className="mt-3 max-w-2xl text-lg text-slate-700">
          Ready-to-use Vietnam itineraries from 3 to 14 days, each with realistic pacing, transport
          suggestions, and what to actually skip.
        </p>
        {items.length === 0 ? (
          <p className="mt-8 text-slate-600">Itineraries coming soon.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((i) => (
              <TripCard
                key={i.frontmatter.slug}
                href={`/itineraries/${i.frontmatter.slug}/`}
                title={i.frontmatter.title}
                blurb={i.frontmatter.description}
                image={i.frontmatter.heroImage}
                imageAlt={i.frontmatter.heroAlt}
                duration={`${i.frontmatter.durationDays} days`}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
