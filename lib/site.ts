export const SITE = {
  name: "Day Trips Vietnam",
  shortName: "DayTripsVietnam",
  url: "https://daytripsvietnam.com",
  description:
    "Independent guides to the best day trips, tours, and itineraries across Vietnam — Hanoi, Ninh Binh, Ha Long Bay, Sapa, Hoi An, Da Nang, Hue, Ho Chi Minh City.",
  locale: "en_US",
  twitter: "@daytripsvietnam",
  defaultOgImage: "/og-default.png",
  organization: {
    "@type": "Organization" as const,
    name: "Day Trips Vietnam",
    url: "https://daytripsvietnam.com",
    logo: "https://daytripsvietnam.com/logo.png",
    sameAs: [],
  },
} as const;

export const absoluteUrl = (path: string): string => {
  if (path.startsWith("http")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${clean}`;
};
