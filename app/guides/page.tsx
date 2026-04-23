import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, buildGraph, orgNode } from "@/lib/schema";
import { getByType } from "@/lib/content";

export const metadata = buildMetadata({
  title: "Vietnam Travel Guides",
  description:
    "In-depth, no-affiliate Vietnam travel guides — visa, best time to visit, transport, food, safety, and everything else you need to plan.",
  path: "/guides/",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Guides", url: "/guides/" },
];

export default function GuidesIndex() {
  const items = getByType("guide").sort((a, b) =>
    b.frontmatter.published.localeCompare(a.frontmatter.published),
  );
  return (
    <>
      <JsonLd data={buildGraph([orgNode(), breadcrumbNode(crumbs)])} />
      <Container size="default" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">Vietnam Travel Guides</h1>
        <p data-speakable className="mt-3 max-w-2xl text-lg text-slate-700">
          Everything you need to plan a trip to Vietnam — visas, weather, transport, food, money, safety.
          Independently researched, regularly updated.
        </p>
        <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {items.map((g) => (
            <li key={g.frontmatter.slug} className="py-5">
              <Link href={`/guides/${g.frontmatter.slug}/`} className="block">
                <h2 className="text-xl font-semibold text-slate-900 group-hover:text-brand-700">
                  {g.frontmatter.title}
                </h2>
                <p className="mt-1 text-slate-600">{g.frontmatter.description}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                  Updated {new Date(g.frontmatter.updated ?? g.frontmatter.published).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
