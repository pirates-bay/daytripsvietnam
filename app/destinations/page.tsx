import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildGraph, breadcrumbNode, orgNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { CITIES } from "@/lib/entities";

export const metadata = buildMetadata({
  title: "Vietnam Destinations — Every City Worth Visiting",
  description:
    "Hanoi, Ninh Binh, Ha Long Bay, Sapa, Ho Chi Minh City, Da Nang, Hoi An, Hue — every major Vietnamese destination with day trips, things to do, and how long to stay.",
  path: "/destinations/",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Destinations", url: "/destinations/" },
];

export default function DestinationsIndex() {
  const byRegion = {
    North: [] as typeof CITIES[keyof typeof CITIES][],
    Central: [] as typeof CITIES[keyof typeof CITIES][],
    South: [] as typeof CITIES[keyof typeof CITIES][],
  };
  for (const c of Object.values(CITIES)) byRegion[c.region].push(c);

  return (
    <>
      <JsonLd data={buildGraph([orgNode(), breadcrumbNode(crumbs)])} />
      <Container size="default" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">Vietnam Destinations</h1>
        <p data-speakable className="mt-3 max-w-2xl text-lg text-slate-700">
          Vietnam splits neatly into three travel regions — the mountainous north (Hanoi, Ha Long Bay, Sapa,
          Ninh Binh), the UNESCO-rich centre (Hue, Hoi An, Da Nang), and the steamy south (Ho Chi Minh City,
          the Mekong Delta). Pick a city to see its best day trips and things to do.
        </p>

        {(["North", "Central", "South"] as const).map((region) => (
          <section key={region} className="mt-10">
            <h2 className="text-2xl font-semibold">{region} Vietnam</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {byRegion[region].map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/destinations/${c.slug}/`}
                    className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-500 hover:shadow-sm"
                  >
                    <h3 className="text-lg font-semibold">{c.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{c.shortBlurb}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}
