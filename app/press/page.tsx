import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  buildGraph,
  orgNode,
  personNode,
} from "@/lib/schema";
import { SITE } from "@/lib/site";
import { AUTHORS } from "@/lib/entities";

export const metadata = buildMetadata({
  title: "Press & Media Kit",
  description:
    "Press kit for Day Trips Vietnam: editor bio, logos, brand assets, and a direct line to Joy Nguyen for journalist enquiries.",
  path: "/press/",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Press", url: "/press/" },
];

const TALKING_POINTS = [
  {
    title: "Independent, operator-free",
    body: "No affiliate booking links, no sponsored tours, no paid placements. Rankings and recommendations are editorial only.",
  },
  {
    title: "Ground-truth research",
    body: "Prices, travel times, and rules are verified against operators and official sources, and revisited within 12 months.",
  },
  {
    title: "Covers the whole country",
    body: "Sixteen city guides, 30+ day trips, full transport hub (flights, trains, sleeper buses, routes), and 14-day itineraries.",
  },
];

const QUOTABLE = [
  {
    topic: "Independent travel to Vietnam",
    quote:
      "Vietnam's transport network is cheaper, faster, and more complete than most first-time visitors expect. The hard part isn't getting around — it's deciding how much country to bite off in one trip.",
  },
  {
    topic: "Sleeper buses vs trains",
    quote:
      "The Reunification Express is slower and more expensive than a sleeper bus, but it's the one overnight journey first-time visitors almost always prefer. Comfort compounds over a two-week itinerary.",
  },
  {
    topic: "Over-touristed vs under-visited",
    quote:
      "Hoi An and Ha Long Bay earn their reputation, but Ninh Binh, Ha Giang, and Phong Nha deliver the same landscapes without the tour-bus queue — often for half the cost.",
  },
];

export default function PressPage() {
  const editor = AUTHORS["joy-nguyen"];
  return (
    <>
      <JsonLd
        data={buildGraph([
          orgNode(),
          breadcrumbNode(crumbs),
          personNode(editor.slug),
        ])}
      />
      <Container size="prose" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">Press & Media Kit</h1>

        <p
          data-speakable
          className="mt-4 text-lg text-slate-700"
        >
          Day Trips Vietnam is an independent Vietnam travel guide covering
          day trips, itineraries, and transport routes. Editor {editor.name} is
          available for interviews, expert commentary, and contributed pieces on
          independent travel in Vietnam and Southeast Asia. Typical response
          time to press enquiries is under 24 hours.
        </p>

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-bold">Contact</h2>
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm">
            <p>
              <span className="font-semibold">Press enquiries:</span>{" "}
              <a
                className="text-brand-700"
                href={`mailto:${SITE.contactEmail}?subject=Press%20enquiry`}
              >
                {SITE.contactEmail}
              </a>
            </p>
            <p className="mt-1">
              <span className="font-semibold">Editor:</span> {editor.name} —{" "}
              <a className="text-brand-700" href={editor.sameAs[0]}>
                portfolio
              </a>
              {" · "}
              <a className="text-brand-700" href={editor.sameAs[1]}>
                LinkedIn
              </a>
            </p>
            <p className="mt-1 text-slate-600">
              High-resolution logos, headshot, and editorial photography
              available on request — email subject line{" "}
              <code>Press: asset request</code>.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-bold">About the publication</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            {TALKING_POINTS.map((p) => (
              <div
                key={p.title}
                className="rounded-lg border border-slate-200 p-4"
              >
                <dt className="font-semibold text-slate-900">{p.title}</dt>
                <dd className="mt-1 text-sm text-slate-600">{p.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-bold">Quotable</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ready-to-quote lines from the editor on recurring story angles.
            Attribution: &ldquo;{editor.name}, editor of Day Trips Vietnam&rdquo;.
          </p>
          <ul className="mt-4 space-y-5">
            {QUOTABLE.map((q) => (
              <li
                key={q.topic}
                className="border-l-4 border-brand-500 pl-4 text-slate-700"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  {q.topic}
                </p>
                <blockquote className="mt-1 italic">&ldquo;{q.quote}&rdquo;</blockquote>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-bold">Editor bio (short)</h2>
          <p className="mt-3 text-slate-700">
            <strong>{editor.name}</strong> is a travel writer focused on Vietnam
            and research-backed travel planning. She edits Day Trips Vietnam
            and covers destinations across the country — from Hanoi and Ha
            Long Bay to the Mekong Delta — translating complex routes, official
            rules, and destination nuance into practical advice for independent
            travellers. Her work has been published at{" "}
            <a className="text-brand-700" href={editor.sameAs[0]}>
              joynguyenwrites.com
            </a>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-bold">Brand basics</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Name</dt>
              <dd className="text-slate-700">{SITE.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">URL</dt>
              <dd>
                <a className="text-brand-700" href={SITE.url}>
                  {SITE.url.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Launched</dt>
              <dd className="text-slate-700">2026</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Coverage</dt>
              <dd className="text-slate-700">Vietnam — nationwide</dd>
            </div>
          </dl>
        </section>

        <p className="mt-10 text-sm text-slate-500">
          Looking for something that isn&rsquo;t here? Email{" "}
          <a className="text-brand-700" href={`mailto:${SITE.contactEmail}`}>
            {SITE.contactEmail}
          </a>{" "}
          — or start with the{" "}
          <Link href="/about/" className="text-brand-700">
            about page
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
