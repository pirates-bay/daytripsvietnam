import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AnswerSummary } from "@/components/content/AnswerSummary";
import { Faq } from "@/components/content/Faq";
import { MdxBody } from "@/components/content/MdxBody";
import { buildMetadata } from "@/lib/seo";
import { buildPageGraph } from "@/lib/schema";
import { getByType, getResearch } from "@/lib/content";

interface Params {
  slug: string;
}

// Visible copy for the source-type badge at the top of every detail page.
// Keeping this map co-located with the hub's copy would tempt us to share it,
// but the tone classes differ (hub uses soft backgrounds, detail uses a
// single pill) so they stay separate on purpose.
const SOURCE_LABELS: Record<string, string> = {
  government: "Government data",
  "peer-reviewed": "Peer-reviewed research",
  industry: "Industry report",
  ngo: "NGO / nonprofit report",
};

export function generateStaticParams(): Params[] {
  return getByType("research").map((d) => ({ slug: d.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const doc = getResearch(slug);
  if (!doc) return {};
  return buildMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/research/${slug}/`,
    image: doc.frontmatter.heroImage,
    imageAlt: doc.frontmatter.heroAlt,
    type: "article",
    publishedTime: doc.frontmatter.published,
    modifiedTime: doc.frontmatter.updated,
    author: doc.frontmatter.author,
  });
}

export default async function ResearchPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const doc = getResearch(slug);
  if (!doc) notFound();

  const fm = doc.frontmatter;
  const url = `/research/${slug}/`;
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Research", url: "/research/" },
    { name: fm.h1 ?? fm.title, url },
  ];

  return (
    <>
      <JsonLd data={buildPageGraph(fm, url, crumbs)} />
      <Container size="prose" className="py-10">
        <Breadcrumbs items={crumbs} />

        <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs font-medium uppercase tracking-wide text-slate-700">
          {SOURCE_LABELS[fm.sourceType] ?? fm.sourceType}
        </span>

        <h1 className="mt-3 font-serif text-4xl font-bold">
          {fm.h1 ?? fm.title}
        </h1>
        <p className="mt-2 text-sm uppercase tracking-wide text-slate-500">
          Updated{" "}
          {new Date(fm.updated ?? fm.published).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div className="mt-6">
          <AnswerSummary>{fm.summary}</AnswerSummary>
        </div>

        {/* Source card. Renders above the body so the reader can verify the
            primary source before they read our synthesis. `rel="noopener"` is
            required on external links; `rel="nofollow"` is deliberately NOT
            applied — Google treats nofollow on cited primary sources as a
            weak negative signal for E-E-A-T. */}
        <aside className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            The study at a glance
          </p>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Title</dt>
              <dd className="text-slate-700">{fm.sourceTitle}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Publisher</dt>
              <dd className="text-slate-700">{fm.sourceOrg}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Published</dt>
              <dd className="text-slate-700">
                {new Date(fm.sourcePublished).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Read it</dt>
              <dd>
                <a
                  className="text-brand-700 underline"
                  href={fm.sourceUrl}
                  rel="noopener"
                  target="_blank"
                >
                  Open primary source ↗
                </a>
              </dd>
            </div>
          </dl>
        </aside>

        <MdxBody source={doc.body} />

        {/* Footer attribution block mirrors the top card but leans into
            citation-style formatting. Journalists and resource-page curators
            scan for this — it's cheap to add and signals primary-source
            handling. */}
        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-serif text-lg font-bold text-slate-900">
            Cite the original research
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            <span className="font-semibold">{fm.sourceOrg}</span> —{" "}
            &ldquo;{fm.sourceTitle}&rdquo;,{" "}
            {new Date(fm.sourcePublished).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
            .{" "}
            <a
              className="text-brand-700 underline"
              href={fm.sourceUrl}
              rel="noopener"
              target="_blank"
            >
              {fm.sourceUrl}
            </a>
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Day Trips Vietnam summarises published research as a reader
            service. We do not control the original source and may not share
            every conclusion.{" "}
            <Link href="/about/" className="text-brand-700 underline">
              About our editorial approach
            </Link>
            .
          </p>
        </section>

        <Faq items={fm.faq} />
      </Container>
    </>
  );
}
