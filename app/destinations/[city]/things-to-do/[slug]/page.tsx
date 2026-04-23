import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/content/Hero";
import { AnswerSummary } from "@/components/content/AnswerSummary";
import { Faq } from "@/components/content/Faq";
import { MdxBody } from "@/components/content/MdxBody";
import { buildMetadata } from "@/lib/seo";
import { buildPageGraph } from "@/lib/schema";
import { getByType } from "@/lib/content";
import { CITIES, isCitySlug } from "@/lib/entities";

interface Params {
  city: string;
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getByType("thing-to-do").map((d) => ({
    city: d.frontmatter.city,
    slug: d.frontmatter.slug,
  }));
}

const findDoc = (city: string, slug: string) =>
  getByType("thing-to-do").find(
    (d) => d.frontmatter.city === city && d.frontmatter.slug === slug,
  );

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { city, slug } = await params;
  const doc = findDoc(city, slug);
  if (!doc) return {};
  return buildMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/destinations/${city}/things-to-do/${slug}/`,
    image: doc.frontmatter.heroImage,
    imageAlt: doc.frontmatter.heroAlt,
  });
}

export default async function ThingPage({ params }: { params: Promise<Params> }) {
  const { city, slug } = await params;
  if (!isCitySlug(city)) notFound();
  const doc = findDoc(city, slug);
  if (!doc) notFound();
  const c = CITIES[city];
  const url = `/destinations/${city}/things-to-do/${slug}/`;
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations/" },
    { name: c.name, url: `/destinations/${city}/` },
    { name: "Things to do", url: `/destinations/${city}/things-to-do/` },
    { name: doc.frontmatter.h1 ?? doc.frontmatter.title, url },
  ];

  return (
    <>
      <JsonLd data={buildPageGraph(doc.frontmatter, url, crumbs)} />
      <Container size="wide" className="py-6">
        <Breadcrumbs items={crumbs} />
        <Hero
          eyebrow={`In ${c.name}`}
          title={doc.frontmatter.h1 ?? doc.frontmatter.title}
          summary={doc.frontmatter.summary}
          image={doc.frontmatter.heroImage}
          imageAlt={doc.frontmatter.heroAlt}
        />
      </Container>
      <Container size="prose" className="py-8">
        <AnswerSummary>{doc.frontmatter.summary}</AnswerSummary>
        <MdxBody source={doc.body} />
        <Faq items={doc.frontmatter.faq} />
      </Container>
    </>
  );
}
