// Canonical social profiles for the Day Trips Vietnam brand. Listed in
// schema.org `sameAs` on the Organization node so journalists and Google can
// verify we're the same entity across platforms. Update when a handle is
// actually claimed — an unpopulated link here is worse than no link.
const SOCIAL = [
  "https://www.facebook.com/daytripsvietnam",
  "https://www.instagram.com/daytripsvietnam",
  "https://www.linkedin.com/company/daytripsvietnam",
  "https://www.youtube.com/@daytripsvietnam",
] as const;

export const SITE = {
  name: "Day Trips Vietnam",
  shortName: "DayTripsVietnam",
  url: "https://daytripsvietnam.com",
  description:
    "Independent guides to the best day trips, tours, and itineraries across Vietnam — Hanoi, Ninh Binh, Ha Long Bay, Sapa, Hoi An, Da Nang, Hue, Ho Chi Minh City.",
  locale: "en_US",
  twitter: "@daytripsvietnam",
  defaultOgImage: "/og-default.png",
  contactEmail: "hello@daytripsvietnam.com",
  social: SOCIAL,
  organization: {
    "@type": "Organization" as const,
    name: "Day Trips Vietnam",
    url: "https://daytripsvietnam.com",
    logo: "https://daytripsvietnam.com/logo.png",
    sameAs: SOCIAL,
  },
} as const;

export const absoluteUrl = (path: string): string => {
  if (path.startsWith("http")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${clean}`;
};
