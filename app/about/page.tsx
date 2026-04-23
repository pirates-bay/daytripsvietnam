import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, buildGraph, orgNode } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "About Day Trips Vietnam",
  description: "Who we are, how we research, and why you can trust our Vietnam travel guides.",
  path: "/about/",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about/" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={buildGraph([orgNode(), breadcrumbNode(crumbs)])} />
      <Container size="prose" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">About Day Trips Vietnam</h1>
        <div className="prose prose-slate mt-6 max-w-none">
          <p>
            Day Trips Vietnam is an independent travel guide. We research every day trip, tour, and itinerary
            on the ground — and we update our pages regularly so what you read reflects the Vietnam of
            today, not five years ago.
          </p>
          <h2>How we research</h2>
          <p>
            Every destination page is written or reviewed by someone who has been there recently. We note
            prices, durations, and transport options as of the latest published date on each page.
          </p>
          <h2>No sponsored placements</h2>
          <p>
            We don't take money from tour operators in exchange for rankings or reviews. When we recommend
            something, it's because we'd send a friend there.
          </p>
          <h2>Contact</h2>
          <p>
            Spotted an error or have a suggestion? Email us at <a href="mailto:hello@daytripsvietnam.com">hello@daytripsvietnam.com</a>.
          </p>
        </div>
      </Container>
    </>
  );
}
