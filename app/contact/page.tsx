import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, buildGraph, orgNode } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with the Day Trips Vietnam editorial team.",
  path: "/contact/",
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Contact", url: "/contact/" },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={buildGraph([orgNode(), breadcrumbNode(crumbs)])} />
      <Container size="prose" className="py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-4xl font-bold">Contact</h1>
        <p className="mt-4 text-lg text-slate-700">
          Email <a className="text-brand-700 underline" href="mailto:hello@daytripsvietnam.com">hello@daytripsvietnam.com</a> with corrections, suggestions, or partnership enquiries. We reply within two business days.
        </p>
      </Container>
    </>
  );
}
