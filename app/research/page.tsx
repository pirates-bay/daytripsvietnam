import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, buildGraph, orgNode } from "@/lib/schema";
import { getByType } from "@/lib/content";

export const metadata = buildMetadata({
  title: "Vietnam Travel Research",
  description:
    "Plain-English summaries of the most cited studies, government reports, and industry surveys on Vietnam travel — what the numbers mean for your trip.",
  path: "/research/",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Research", url: "/research/" },
];

// Badge copy mirrors the four `sourceType` enum values so journalists can
// scan the hub and see at a glance which entries are peer-reviewed versus
// industry surveys.
const SOURCE_LABELS: Record<string, { label: string; tone: string }> = {
  government: { label: "Government data", tone: "bg-blue-50 text-blue-700 border-blue-200" },
  "peer-reviewed": { label: "Peer-reviewed", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  industry: { label: "Industry report", tone: "bg-amber-50 text-amber-700 border-amber-200" },
  ngo: { label: "NGO / nonprofit", tone: "bg-violet-50 text-violet-700 border-violet-200" },
};

export default function ResearchIndex() {
  const items = getByType("research").sort((a, b) =>
    b.frontmatter.published.localeCompare(a.frontmatter.published),
  );

  return (
    <>
      <JsonLd data={buildGraph([orgNode(), breadcrumbNode(crumbs)])} />
      <Container size="default" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">Vietnam Travel Research</h1>
        <p data-speakable className="mt-3 max-w-3xl text-lg text-slate-700">
          Plain-English summaries of the most cited studies, government
          reports, and industry surveys on Vietnam travel — each one
          translated into what the numbers mean for your trip. Every figure
          cites its source. No data is made up.
        </p>

        {items.length === 0 ? (
          <p className="mt-8 text-slate-600">
            No research articles published yet — the first batch is on its
            way. In the meantime, our{" "}
            <Link href="/guides/" className="text-brand-700 underline">
              Vietnam travel guides
            </Link>{" "}
            cover most planning questions.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.map((r) => {
              const badge = SOURCE_LABELS[r.frontmatter.sourceType] ?? {
                label: r.frontmatter.sourceType,
                tone: "bg-slate-50 text-slate-700 border-slate-200",
              };
              return (
                <li
                  key={r.frontmatter.slug}
                  className="rounded-lg border border-slate-200 p-5 transition hover:border-brand-300 hover:shadow-sm"
                >
                  <Link href={`/research/${r.frontmatter.slug}/`} className="block">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${badge.tone}`}
                    >
                      {badge.label}
                    </span>
                    <h2 className="mt-3 text-lg font-semibold text-slate-900">
                      {r.frontmatter.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {r.frontmatter.description}
                    </p>
                    <p className="mt-3 text-xs text-slate-500">
                      Source: {r.frontmatter.sourceOrg}
                      {" · "}
                      Updated{" "}
                      {new Date(
                        r.frontmatter.updated ?? r.frontmatter.published,
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <section className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
          <h2 className="font-serif text-xl font-bold text-slate-900">
            How we choose what to cover
          </h2>
          <p className="mt-2">
            We prioritise research with a named author or institution, a
            reproducible methodology, and findings that change how a traveller
            should plan. Every article links directly to the primary source so
            you can verify or read deeper. We do not paraphrase behind a paywall
            — if a study is paywalled, we say so and summarise only what the
            abstract and public materials permit.
          </p>
        </section>
      </Container>
    </>
  );
}
