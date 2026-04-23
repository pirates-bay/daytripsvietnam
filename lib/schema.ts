import { SITE, absoluteUrl } from "./site";
import { getCity as getCityEntity } from "./entities";
import type {
  CityDoc,
  DayTripDoc,
  GuideDoc,
  ItineraryDoc,
  ThingToDoDoc,
  CompareDoc,
  Frontmatter,
} from "./content";

type Faq = { q: string; a: string }[];

export const orgNode = () => ({
  "@type": "Organization",
  "@id": `${SITE.url}#org`,
  name: SITE.name,
  url: SITE.url,
  logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
  sameAs: SITE.organization.sameAs,
});

export const websiteNode = () => ({
  "@type": "WebSite",
  "@id": `${SITE.url}#site`,
  url: SITE.url,
  name: SITE.name,
  description: SITE.description,
  inLanguage: "en",
  publisher: { "@id": `${SITE.url}#org` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE.url}/search/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbNode = (items: { name: string; url: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.url),
  })),
});

export const faqNode = (faq: Faq) =>
  faq.length === 0
    ? null
    : {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      };

export const speakableNode = () => ({
  "@type": "SpeakableSpecification",
  cssSelector: ["[data-speakable]"],
});

export const articleNode = (doc: {
  frontmatter: GuideDoc | CompareDoc;
  url: string;
}) => {
  const fm = doc.frontmatter;
  return {
    "@type": "Article",
    headline: fm.h1 ?? fm.title,
    description: fm.description,
    image: fm.heroImage ? [absoluteUrl(fm.heroImage)] : [absoluteUrl(SITE.defaultOgImage)],
    datePublished: fm.published,
    dateModified: fm.updated ?? fm.published,
    author: { "@type": "Person", name: fm.author },
    publisher: { "@id": `${SITE.url}#org` },
    mainEntityOfPage: absoluteUrl(doc.url),
    inLanguage: "en",
    speakable: speakableNode(),
  };
};

export const touristDestinationNode = (doc: { frontmatter: CityDoc; url: string }) => {
  const fm = doc.frontmatter;
  const city = getCityEntity(fm.city);
  return {
    "@type": "TouristDestination",
    name: city?.name ?? fm.title,
    description: fm.description,
    url: absoluteUrl(doc.url),
    ...(city && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: city.latitude,
        longitude: city.longitude,
      },
      containedInPlace: { "@type": "Country", name: "Vietnam" },
    }),
    image: fm.heroImage ? absoluteUrl(fm.heroImage) : undefined,
  };
};

export const touristTripNode = (doc: { frontmatter: DayTripDoc; url: string }) => {
  const fm = doc.frontmatter;
  const node: Record<string, unknown> = {
    "@type": "TouristTrip",
    name: fm.h1 ?? fm.title,
    description: fm.description,
    url: absoluteUrl(doc.url),
    image: fm.heroImage ? absoluteUrl(fm.heroImage) : absoluteUrl(SITE.defaultOgImage),
    provider: { "@id": `${SITE.url}#org` },
    touristType: "Independent traveler",
    inLanguage: "en",
  };
  if (fm.duration) node.duration = fm.duration;
  if (fm.startLocation) {
    node.departureLocation = { "@type": "Place", name: fm.startLocation };
  }
  if (fm.endLocation) {
    node.arrivalLocation = { "@type": "Place", name: fm.endLocation };
  }
  if (fm.priceFrom) {
    node.offers = {
      "@type": "Offer",
      price: fm.priceFrom.amount,
      priceCurrency: fm.priceFrom.currency,
      availability: fm.bookable ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      url: fm.bookingUrl ?? absoluteUrl(doc.url),
    };
  }
  return node;
};

export const itineraryNode = (doc: { frontmatter: ItineraryDoc; url: string }) => {
  const fm = doc.frontmatter;
  return {
    "@type": "TouristTrip",
    name: fm.h1 ?? fm.title,
    description: fm.description,
    url: absoluteUrl(doc.url),
    image: fm.heroImage ? absoluteUrl(fm.heroImage) : absoluteUrl(SITE.defaultOgImage),
    duration: `P${fm.durationDays}D`,
    provider: { "@id": `${SITE.url}#org` },
    itinerary: {
      "@type": "ItemList",
      itemListElement: fm.cities.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "City", name: c },
      })),
    },
  };
};

export const touristAttractionNode = (doc: {
  frontmatter: ThingToDoDoc;
  url: string;
}) => {
  const fm = doc.frontmatter;
  const city = getCityEntity(fm.city);
  return {
    "@type": "TouristAttraction",
    name: fm.h1 ?? fm.title,
    description: fm.description,
    url: absoluteUrl(doc.url),
    image: fm.heroImage ? absoluteUrl(fm.heroImage) : undefined,
    ...(city && {
      containedInPlace: {
        "@type": "City",
        name: city.name,
        address: {
          "@type": "PostalAddress",
          addressCountry: "VN",
          addressLocality: city.name,
        },
      },
    }),
  };
};

export const buildGraph = (nodes: Array<Record<string, unknown> | null | undefined>) => ({
  "@context": "https://schema.org",
  "@graph": nodes.filter((n): n is Record<string, unknown> => !!n),
});

export const buildPageGraph = (
  fm: Frontmatter,
  url: string,
  breadcrumbs: { name: string; url: string }[],
) => {
  const nodes: Array<Record<string, unknown> | null | undefined> = [
    orgNode(),
    breadcrumbNode(breadcrumbs),
    faqNode(fm.faq),
  ];
  switch (fm.type) {
    case "city":
      nodes.push(touristDestinationNode({ frontmatter: fm, url }));
      break;
    case "day-trip":
      nodes.push(touristTripNode({ frontmatter: fm, url }));
      break;
    case "thing-to-do":
      nodes.push(touristAttractionNode({ frontmatter: fm, url }));
      break;
    case "itinerary":
      nodes.push(itineraryNode({ frontmatter: fm, url }));
      break;
    case "guide":
      nodes.push(articleNode({ frontmatter: fm, url }));
      break;
    case "compare":
      nodes.push(articleNode({ frontmatter: fm, url }));
      break;
  }
  return buildGraph(nodes);
};
