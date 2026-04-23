import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AnswerSummary } from "@/components/content/AnswerSummary";
import { Faq } from "@/components/content/Faq";
import { MdxBody } from "@/components/content/MdxBody";
import { buildMetadata } from "@/lib/seo";
import { buildPageGraph } from "@/lib/schema";
import { getByType, getGuide } from "@/lib/content";

interface Params { slug: string; }

export function generateStaticParams(): Params[] {
  return getByType("guide").map((d) => ({ slug: d.frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getGuide(slug);
  if (!doc) return {};
  return buildMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/guides/${slug}/`,
    image: doc.frontmatter.heroImage,
    imageAlt: doc.frontmatter.heroAlt,
    type: "article",
    publishedTime: doc.frontmatter.published,
    modifiedTime: doc.frontmatter.updated,
    author: doc.frontmatter.author,
  });
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getGuide(slug);
  if (!doc) notFound();
  const url = `/guides/${slug}/`;
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides/" },
    { name: doc.frontmatter.h1 ?? doc.frontmatter.title, url },
  ];

  return (
    <>
      <JsonLd data={buildPageGraph(doc.frontmatter, url, crumbs)} />
      <Container size="prose" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">{doc.frontmatter.h1 ?? doc.frontmatter.title}</h1>
        <p className="mt-2 text-sm uppercase tracking-wide text-slate-500">
          Updated {new Date(doc.frontmatter.updated ?? doc.frontmatter.published).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <div className="mt-6">
          <AnswerSummary>{doc.frontmatter.summary}</AnswerSummary>
        </div>
        <MdxBody source={doc.body} />
        <Faq items={doc.frontmatter.faq} />
      </Container>
    </>
  );
}
