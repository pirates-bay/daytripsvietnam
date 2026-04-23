import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AnswerSummary } from "@/components/content/AnswerSummary";
import { Faq } from "@/components/content/Faq";
import { MdxBody } from "@/components/content/MdxBody";
import { buildMetadata } from "@/lib/seo";
import { buildPageGraph } from "@/lib/schema";
import { getByType, getCompare } from "@/lib/content";

interface Params { pair: string; }

export function generateStaticParams(): Params[] {
  return getByType("compare").map((d) => ({ pair: d.frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { pair } = await params;
  const doc = getCompare(pair);
  if (!doc) return {};
  return buildMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/compare/${pair}/`,
    image: doc.frontmatter.heroImage,
    imageAlt: doc.frontmatter.heroAlt,
    type: "article",
    publishedTime: doc.frontmatter.published,
    modifiedTime: doc.frontmatter.updated,
    author: doc.frontmatter.author,
  });
}

export default async function ComparePage({ params }: { params: Promise<Params> }) {
  const { pair } = await params;
  const doc = getCompare(pair);
  if (!doc) notFound();
  const url = `/compare/${pair}/`;
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Compare", url: "/compare/" },
    { name: doc.frontmatter.h1 ?? doc.frontmatter.title, url },
  ];
  return (
    <>
      <JsonLd data={buildPageGraph(doc.frontmatter, url, crumbs)} />
      <Container size="prose" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">{doc.frontmatter.h1 ?? doc.frontmatter.title}</h1>
        <div className="mt-6">
          <AnswerSummary>{doc.frontmatter.summary}</AnswerSummary>
        </div>
        <MdxBody source={doc.body} />
        <Faq items={doc.frontmatter.faq} />
      </Container>
    </>
  );
}
