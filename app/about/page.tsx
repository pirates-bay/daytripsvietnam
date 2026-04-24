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
  title: "About Day Trips Vietnam",
  description:
    "Who writes Day Trips Vietnam, how we research, and why our guides are independent of tour operators and booking platforms.",
  path: "/about/",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about/" },
];

export default function AboutPage() {
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
        <h1 className="font-serif text-4xl font-bold">About Day Trips Vietnam</h1>

        <p
          data-speakable
          className="mt-4 text-lg text-slate-700"
        >
          Day Trips Vietnam is an independent travel guide edited by{" "}
          <Link href="#editor" className="text-brand-700 underline">
            {editor.name}
          </Link>
          . We research every day trip, tour, and itinerary on the ground, note
          prices and travel times as of the latest update, and take no money
          from tour operators in exchange for rankings or reviews.
        </p>

        <section id="editor" className="mt-12 scroll-mt-24">
          <h2 className="font-serif text-2xl font-bold">Editor</h2>
          <div className="mt-4 flex flex-col gap-6 rounded-lg border border-slate-200 bg-slate-50 p-6 sm:flex-row">
            <div
              aria-hidden
              className="h-24 w-24 shrink-0 rounded-full bg-gradient-to-br from-brand-200 to-brand-500 sm:h-28 sm:w-28"
            />
            <div className="prose prose-slate max-w-none text-slate-700">
              <p className="!mt-0 font-serif text-xl font-semibold text-slate-900">
                {editor.name}
              </p>
              <p className="!mt-1 text-sm uppercase tracking-wide text-slate-500">
                {editor.jobTitle}, Day Trips Vietnam
              </p>
              <p>{editor.description}</p>
              <p className="!mb-0 text-sm">
                <a
                  className="text-brand-700 underline"
                  href={editor.sameAs[0]}
                  rel="author"
                >
                  Portfolio
                </a>
                {" · "}
                <a
                  className="text-brand-700 underline"
                  href={editor.sameAs[1]}
                  rel="author"
                >
                  LinkedIn
                </a>
                {" · "}
                <a
                  className="text-brand-700 underline"
                  href={`mailto:${SITE.contactEmail}`}
                >
                  {SITE.contactEmail}
                </a>
              </p>
            </div>
          </div>
        </section>

        <div className="prose prose-slate mt-10 max-w-none">
          <h2>How we research</h2>
          <p>
            Every destination page is written or reviewed by someone who has
            been there recently. We note prices, durations, and transport
            options as of the publication date shown on each page, and we
            revisit anything older than 12 months. When a fact comes from an
            operator or official source — a train timetable, a visa rule, a
            national park fee — we link it. When it comes from personal
            experience, we say so.
          </p>

          <h2>No sponsored placements</h2>
          <p>
            We don't take money, free tours, or affiliate deals from operators
            in exchange for rankings or reviews. Every recommendation on this
            site is made on editorial grounds only. If we ever introduce
            booking links (not planned for 2026), they will be disclosed on
            every page they appear on and will never change the order in which
            options are ranked.
          </p>

          <h2>Corrections policy</h2>
          <p>
            Found an error? Email{" "}
            <a
              className="text-brand-700"
              href={`mailto:${SITE.contactEmail}`}
            >
              {SITE.contactEmail}
            </a>{" "}
            with the page URL and what's wrong. We reply within two business
            days, publish a correction note where appropriate, and update the
            page's <code>updated</code> date so readers can tell the guide has
            been revised.
          </p>

          <h2>Press & partnerships</h2>
          <p>
            Journalists, guidebook editors, and fellow travel publications:
            see the{" "}
            <Link href="/press/" className="text-brand-700">
              press page
            </Link>{" "}
            for bio, logos, and a downloadable media kit. Joy is available for
            interviews on Vietnam itineraries, overland transport, and
            independent-travel planning.
          </p>
        </div>
      </Container>
    </>
  );
}
