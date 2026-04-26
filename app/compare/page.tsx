import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, buildGraph, orgNode } from "@/lib/schema";
import { getByType } from "@/lib/content";

export const metadata = buildMetadata({
  title: "Vietnam Destination & Travel Comparisons",
  description:
    "Side-by-side comparisons of Vietnam destinations and travel choices — Hanoi vs HCMC, Hoi An vs Hue, Ha Long vs Cat Ba, sleeper bus vs train. Pick the right option for your trip.",
  path: "/compare/",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Compare", url: "/compare/" },
];

export default function CompareIndex() {
  const items = getByType("compare").sort((a, b) =>
    b.frontmatter.published.localeCompare(a.frontmatter.published),
  );

  return (
    <>
      <JsonLd data={buildGraph([orgNode(), breadcrumbNode(crumbs)])} />
      <Container size="default" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">
          Vietnam Destination & Travel Comparisons
        </h1>
        <p data-speakable className="mt-3 max-w-3xl text-lg text-slate-700">
          Honest, side-by-side comparisons of the choices most travellers face
          when planning a Vietnam trip — which city to base in, which UNESCO
          town to visit, which transport mode to take. Each comparison ends
          with a clear &ldquo;pick X if &hellip;, pick Y if &hellip;&rdquo;
          recommendation.
        </p>

        {items.length === 0 ? (
          <p className="mt-8 text-slate-600">
            No comparisons published yet — check back soon. In the meantime,
            our{" "}
            <Link href="/guides/" className="text-brand-700 underline">
              Vietnam travel guides
            </Link>{" "}
            cover the most common planning questions.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.map((c) => (
              <li
                key={c.frontmatter.slug}
                className="rounded-lg border border-slate-200 p-5 transition hover:border-brand-300 hover:shadow-sm"
              >
                <Link href={`/compare/${c.frontmatter.slug}/`} className="block">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {c.frontmatter.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {c.frontmatter.description}
                  </p>
                  <p className="mt-3 text-xs text-slate-500">
                    Updated{" "}
                    {new Date(
                      c.frontmatter.updated ?? c.frontmatter.published,
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
