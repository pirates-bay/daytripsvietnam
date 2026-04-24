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
import { getByType, getTransport } from "@/lib/content";
import { getCity } from "@/lib/entities";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getByType("transport").map((d) => ({ slug: d.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const doc = getTransport(slug);
  if (!doc) return {};
  return buildMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/transport/${slug}/`,
    image: doc.frontmatter.heroImage,
    imageAlt: doc.frontmatter.heroAlt,
    type: "article",
    publishedTime: doc.frontmatter.published,
    modifiedTime: doc.frontmatter.updated,
    author: doc.frontmatter.author,
  });
}

const CATEGORY_LABEL: Record<string, string> = {
  pillar: "Overview",
  mode: "By mode",
  brand: "Operator",
  route: "Route",
};

export default async function TransportPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const doc = getTransport(slug);
  if (!doc) notFound();
  const url = `/transport/${slug}/`;
  const fm = doc.frontmatter;
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Transport", url: "/transport/" },
    { name: fm.h1 ?? fm.title, url },
  ];

  const fromCity = fm.from ? getCity(fm.from) : undefined;
  const toCity = fm.to ? getCity(fm.to) : undefined;

  // Small fact table rendered under the H1 for brand / route / mode articles
  const facts: Array<{ label: string; value: string }> = [];
  if (fm.category === "route" && fromCity && toCity) {
    facts.push({ label: "From", value: fromCity.name });
    facts.push({ label: "To", value: toCity.name });
  }
  if (fm.operator) facts.push({ label: "Operator", value: fm.operator });
  if (fm.mode) {
    facts.push({
      label: "Mode",
      value: fm.mode.charAt(0).toUpperCase() + fm.mode.slice(1),
    });
  }
  if (fm.duration) {
    // ISO 8601 PTnH(nM)? or PTnM — match either form
    const hm = /^PT(\d+)H(?:(\d+)M)?$/.exec(fm.duration);
    const mOnly = /^PT(\d+)M$/.exec(fm.duration);
    let value: string | undefined;
    if (hm) {
      const h = Number(hm[1]);
      const m = Number(hm[2] ?? 0);
      value = m ? `${h}h ${m}m` : `${h}h`;
    } else if (mOnly) {
      value = `${mOnly[1]}m`;
    }
    if (value) facts.push({ label: "Typical duration", value });
  }
  if (fm.priceFrom) {
    facts.push({
      label: "From",
      value: `${fm.priceFrom.currency} ${fm.priceFrom.amount}`,
    });
  }

  return (
    <>
      <JsonLd data={buildPageGraph(fm, url, crumbs)} />
      <Container size="prose" className="py-10">
        <Breadcrumbs items={crumbs} />
        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-brand-700">
          {CATEGORY_LABEL[fm.category] ?? "Transport"}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold">
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

        {facts.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  {f.label}
                </dt>
                <dd className="font-medium text-slate-900">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6">
          <AnswerSummary>{fm.summary}</AnswerSummary>
        </div>
        <MdxBody source={doc.body} />
        <Faq items={fm.faq} />

        {(fromCity || toCity) && (
          <nav
            aria-label="Related destinations"
            className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-600"
          >
            <p className="font-semibold text-slate-900">Destination guides</p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {fromCity && (
                <li>
                  <Link
                    href={`/destinations/${fromCity.slug}/`}
                    className="text-brand-700 hover:underline"
                  >
                    {fromCity.name} guide
                  </Link>
                </li>
              )}
              {toCity && (
                <li>
                  <Link
                    href={`/destinations/${toCity.slug}/`}
                    className="text-brand-700 hover:underline"
                  >
                    {toCity.name} guide
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </Container>
    </>
  );
}
