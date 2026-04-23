import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, buildGraph, orgNode } from "@/lib/schema";
import { getThingsByCity } from "@/lib/content";
import { CITIES, CITY_SLUGS, isCitySlug } from "@/lib/entities";

interface Params { city: string; }

export function generateStaticParams(): Params[] {
  return CITY_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { city } = await params;
  if (!isCitySlug(city)) return {};
  const c = CITIES[city];
  return buildMetadata({
    title: `Things to Do in ${c.name}`,
    description: `The best things to do in ${c.name}, Vietnam — curated by locals and independent travel writers.`,
    path: `/destinations/${city}/things-to-do/`,
  });
}

export default async function ThingsList({ params }: { params: Promise<Params> }) {
  const { city } = await params;
  if (!isCitySlug(city)) notFound();
  const c = CITIES[city];
  const things = getThingsByCity(city);
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations/" },
    { name: c.name, url: `/destinations/${city}/` },
    { name: "Things to do", url: `/destinations/${city}/things-to-do/` },
  ];

  return (
    <>
      <JsonLd data={buildGraph([orgNode(), breadcrumbNode(crumbs)])} />
      <Container size="default" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">Things to Do in {c.name}</h1>
        {things.length === 0 ? (
          <p className="mt-6 text-slate-600">Guides coming soon.</p>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
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
        )}
      </Container>
    </>
  );
}
