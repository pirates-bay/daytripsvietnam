import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/content/Hero";
import { AnswerSummary } from "@/components/content/AnswerSummary";
import { Faq } from "@/components/content/Faq";
import { RelatedLinks } from "@/components/content/RelatedLinks";
import { MdxBody } from "@/components/content/MdxBody";
import { buildMetadata } from "@/lib/seo";
import { buildPageGraph } from "@/lib/schema";
import { getByType, getDayTrip } from "@/lib/content";
import { CITIES, isCitySlug } from "@/lib/entities";

interface Params {
  city: string;
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getByType("day-trip").map((d) => ({
    city: d.frontmatter.city,
    slug: d.frontmatter.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { city, slug } = await params;
  const doc = getDayTrip(city, slug);
  if (!doc) return {};
  return buildMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/destinations/${city}/day-trips/${slug}/`,
    image: doc.frontmatter.heroImage,
    imageAlt: doc.frontmatter.heroAlt,
    type: "article",
    publishedTime: doc.frontmatter.published,
    modifiedTime: doc.frontmatter.updated,
    author: doc.frontmatter.author,
  });
}

export default async function DayTripPage({ params }: { params: Promise<Params> }) {
  const { city, slug } = await params;
  if (!isCitySlug(city)) notFound();
  const doc = getDayTrip(city, slug);
  if (!doc) notFound();
  const c = CITIES[city];
  const url = `/destinations/${city}/day-trips/${slug}/`;
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations/" },
    { name: c.name, url: `/destinations/${city}/` },
    { name: "Day Trips", url: `/destinations/${city}/day-trips/` },
    { name: doc.frontmatter.h1 ?? doc.frontmatter.title, url },
  ];

  const related = doc.frontmatter.related
    .map((rs) => getDayTrip(city, rs))
    .filter((x): x is NonNullable<typeof x> => !!x)
    .slice(0, 3)
    .map((r) => ({
      href: `/destinations/${city}/day-trips/${r.frontmatter.slug}/`,
      title: r.frontmatter.title,
    }));

  return (
    <>
      <JsonLd data={buildPageGraph(doc.frontmatter, url, crumbs)} />
      <Container size="wide" className="py-6">
        <Breadcrumbs items={crumbs} />
        <Hero
          eyebrow={`Day trip from ${c.name}`}
          title={doc.frontmatter.h1 ?? doc.frontmatter.title}
          summary={doc.frontmatter.summary}
          image={doc.frontmatter.heroImage}
          imageAlt={doc.frontmatter.heroAlt}
        />
      </Container>

      <Container size="prose" className="py-8">
        <AnswerSummary>{doc.frontmatter.summary}</AnswerSummary>

        {(doc.frontmatter.duration || doc.frontmatter.priceFrom || doc.frontmatter.startLocation) && (
          <dl className="my-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm sm:grid-cols-4">
            {doc.frontmatter.duration && (
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Duration</dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {doc.frontmatter.duration.replace("PT", "").toLowerCase()}
                </dd>
              </div>
            )}
            {doc.frontmatter.priceFrom && (
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">From</dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {doc.frontmatter.priceFrom.currency} {doc.frontmatter.priceFrom.amount}
                </dd>
              </div>
            )}
            {doc.frontmatter.startLocation && (
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Departs</dt>
                <dd className="mt-1 font-medium text-slate-900">{doc.frontmatter.startLocation}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">Updated</dt>
              <dd className="mt-1 font-medium text-slate-900">
                {new Date(doc.frontmatter.updated ?? doc.frontmatter.published).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
          </dl>
        )}

        <MdxBody source={doc.body} />
        <Faq items={doc.frontmatter.faq} />
        <RelatedLinks items={related} heading={`More day trips from ${c.name}`} />
      </Container>
    </>
  );
}
