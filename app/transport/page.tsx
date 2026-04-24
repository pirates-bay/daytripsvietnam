import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, buildGraph, orgNode } from "@/lib/schema";
import { getByType } from "@/lib/content";
import { getCity } from "@/lib/entities";

export const metadata = buildMetadata({
  title: "Vietnam Transport Guide",
  description:
    "How to get around Vietnam — flights, trains, sleeper buses, and city-pair routes. Airlines, operators, and real prices. Independently researched.",
  path: "/transport/",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Transport", url: "/transport/" },
];

const SECTIONS: Array<{
  key: "pillar" | "mode" | "brand" | "route";
  heading: string;
  blurb: string;
}> = [
  {
    key: "pillar",
    heading: "Getting around Vietnam",
    blurb: "Start here — how the country's transport system works end to end.",
  },
  {
    key: "mode",
    heading: "By mode",
    blurb: "Deep dives on flights, trains, sleeper buses, taxis, and motorbike rental.",
  },
  {
    key: "brand",
    heading: "Airlines & operators",
    blurb: "Real experience of the carriers and bus companies you'll actually book.",
  },
  {
    key: "route",
    heading: "Popular routes",
    blurb: "City-pair guides — every option, price, and travel time for the journeys most travellers take.",
  },
];

export default function TransportHub() {
  const all = getByType("transport").sort((a, b) =>
    a.frontmatter.title.localeCompare(b.frontmatter.title),
  );

  const byCategory = {
    pillar: all.filter((d) => d.frontmatter.category === "pillar"),
    mode: all.filter((d) => d.frontmatter.category === "mode"),
    brand: all.filter((d) => d.frontmatter.category === "brand"),
    route: all.filter((d) => d.frontmatter.category === "route"),
  };

  return (
    <>
      <JsonLd data={buildGraph([orgNode(), breadcrumbNode(crumbs)])} />
      <Container size="default" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">Vietnam Transport</h1>
        <p
          data-speakable
          className="mt-3 max-w-2xl text-lg text-slate-700"
        >
          Vietnam's transport network is cheaper, faster, and more complete than
          most first-time visitors expect. Domestic flights cover the long
          distances, sleeper buses and trains handle the overnight legs, and
          motorbikes or Grab take care of everything in between. These guides
          cover every mode, every major operator, and the city-pair routes that
          actually matter.
        </p>

        {SECTIONS.map(({ key, heading, blurb }) => {
          const items = byCategory[key];
          if (items.length === 0) return null;
          return (
            <section key={key} className="mt-10">
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                {heading}
              </h2>
              <p className="mt-1 text-slate-600">{blurb}</p>
              <ul
                className={
                  key === "route"
                    ? "mt-6 grid gap-3 sm:grid-cols-2"
                    : "mt-6 divide-y divide-slate-200 border-y border-slate-200"
                }
              >
                {items.map((d) => {
                  const fm = d.frontmatter;
                  if (key === "route") {
                    const fromCity = fm.from ? getCity(fm.from) : undefined;
                    const toCity = fm.to ? getCity(fm.to) : undefined;
                    const label =
                      fromCity && toCity
                        ? `${fromCity.name} → ${toCity.name}`
                        : fm.title;
                    return (
                      <li key={fm.slug}>
                        <Link
                          href={`/transport/${fm.slug}/`}
                          className="block rounded-lg border border-slate-200 p-4 transition hover:border-brand-500 hover:bg-slate-50"
                        >
                          <h3 className="text-base font-semibold text-slate-900">
                            {label}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                            {fm.description}
                          </p>
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={fm.slug} className="py-5">
                      <Link
                        href={`/transport/${fm.slug}/`}
                        className="block"
                      >
                        <h3 className="text-xl font-semibold text-slate-900 hover:text-brand-700">
                          {fm.title}
                        </h3>
                        <p className="mt-1 text-slate-600">{fm.description}</p>
                        {fm.operator && (
                          <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                            {fm.operator}
                          </p>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        {all.length === 0 && (
          <p className="mt-10 text-slate-500">
            Transport content is being published — check back shortly.
          </p>
        )}
      </Container>
    </>
  );
}
