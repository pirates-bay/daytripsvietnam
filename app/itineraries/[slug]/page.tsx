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
import { getByType, getItinerary } from "@/lib/content";

interface Params { slug: string; }

export function generateStaticParams(): Params[] {
  return getByType("itinerary").map((d) => ({ slug: d.frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getItinerary(slug);
  if (!doc) return {};
  return buildMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/itineraries/${slug}/`,
    image: doc.frontmatter.heroImage,
    imageAlt: doc.frontmatter.heroAlt,
    type: "article",
    publishedTime: doc.frontmatter.published,
    modifiedTime: doc.frontmatter.updated,
    author: doc.frontmatter.author,
  });
}

export default async function ItineraryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getItinerary(slug);
  if (!doc) notFound();
  const url = `/itineraries/${slug}/`;
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Itineraries", url: "/itineraries/" },
    { name: doc.frontmatter.h1 ?? doc.frontmatter.title, url },
  ];

  return (
    <>
      <JsonLd data={buildPageGraph(doc.frontmatter, url, crumbs)} />
      <Container size="wide" className="py-6">
        <Breadcrumbs items={crumbs} />
        <Hero
          eyebrow={`${doc.frontmatter.durationDays}-day itinerary`}
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
