import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/content/Hero";
import { AnswerSummary } from "@/components/content/AnswerSummary";
import { Faq } from "@/components/content/Faq";
import { TripCard } from "@/components/content/TripCard";
import { MdxBody } from "@/components/content/MdxBody";
import { buildMetadata } from "@/lib/seo";
import { buildPageGraph } from "@/lib/schema";
import { getCity, getDayTripsByCity, getThingsByCity } from "@/lib/content";
import { CITIES, CITY_SLUGS, isCitySlug } from "@/lib/entities";

interface Params {
  city: string;
}

export function generateStaticParams(): Params[] {
  return CITY_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { city } = await params;
  const doc = getCity(city);
  if (!doc) return {};
  return buildMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/destinations/${city}/`,
    image: doc.frontmatter.heroImage,
    imageAlt: doc.frontmatter.heroAlt,
  });
}

export default async function CityHub({ params }: { params: Promise<Params> }) {
  const { city } = await params;
  if (!isCitySlug(city)) notFound();
  const doc = getCity(city);
  if (!doc) notFound();
  const entity = CITIES[city];

  const trips = getDayTripsByCity(city);
  const things = getThingsByCity(city);
  const url = `/destinations/${city}/`;
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations/" },
    { name: entity.name, url },
  ];

  return (
    <>
      <JsonLd data={buildPageGraph(doc.frontmatter, url, crumbs)} />
      <Container size="wide" className="py-6">
        <Breadcrumbs items={crumbs} />
        <Hero
          eyebrow={`${entity.region} Vietnam`}
          title={doc.frontmatter.h1 ?? doc.frontmatter.title}
          summary={doc.frontmatter.summary}
          image={doc.frontmatter.heroImage}
          imageAlt={doc.frontmatter.heroAlt}
        />
      </Container>

      <Container size="prose" className="py-8">
        <AnswerSummary>{doc.frontmatter.summary}</AnswerSummary>
        <MdxBody source={doc.body} />
      </Container>

      {trips.length > 0 && (
        <Container size="wide" className="py-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold">Day trips from {entity.name}</h2>
            <Link
              href={`/destinations/${city}/day-trips/`}
              className="text-sm text-brand-700 hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </Container>
      )}

      {things.length > 0 && (
        <Container size="wide" className="py-8">
          <h2 className="text-2xl font-semibold">Things to do in {entity.name}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {things.map((t) => (
              <li key={t.frontmatter.slug}>
                <Link
                  href={`/destinations/${city}/things-to-do/${t.frontmatter.slug}/`}
                  className="block rounded-lg border border-slate-200 p-4 hover:border-brand-500"
                >
                  <p className="font-medium">{t.frontmatter.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{t.frontmatter.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}

      <Container size="prose" className="py-4">
        <Faq items={doc.frontmatter.faq} />
      </Container>
    </>
  );
}
