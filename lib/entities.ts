export type CitySlug =
  | "hanoi"
  | "ninh-binh"
  | "ha-long-bay"
  | "sapa"
  | "ho-chi-minh-city"
  | "da-nang"
  | "hoi-an"
  | "hue";

export interface CityEntity {
  slug: CitySlug;
  name: string;
  region: "North" | "Central" | "South";
  shortBlurb: string;
  latitude: number;
  longitude: number;
}

export const CITIES: Record<CitySlug, CityEntity> = {
  hanoi: {
    slug: "hanoi",
    name: "Hanoi",
    region: "North",
    shortBlurb: "Vietnam's 1,000-year-old capital and launchpad for the north.",
    latitude: 21.0285,
    longitude: 105.8542,
  },
  "ninh-binh": {
    slug: "ninh-binh",
    name: "Ninh Binh",
    region: "North",
    shortBlurb: "Limestone karsts, rice fields, and river caves two hours south of Hanoi.",
    latitude: 20.2506,
    longitude: 105.9745,
  },
  "ha-long-bay": {
    slug: "ha-long-bay",
    name: "Ha Long Bay",
    region: "North",
    shortBlurb: "UNESCO seascape of 1,600 emerald-green islands and junk-boat cruises.",
    latitude: 20.9101,
    longitude: 107.1839,
  },
  sapa: {
    slug: "sapa",
    name: "Sapa",
    region: "North",
    shortBlurb: "Terraced rice valleys and hill-tribe villages in the far northwest.",
    latitude: 22.3364,
    longitude: 103.8438,
  },
  "ho-chi-minh-city": {
    slug: "ho-chi-minh-city",
    name: "Ho Chi Minh City",
    region: "South",
    shortBlurb: "Vietnam's biggest, loudest, most energetic metropolis — aka Saigon.",
    latitude: 10.8231,
    longitude: 106.6297,
  },
  "da-nang": {
    slug: "da-nang",
    name: "Da Nang",
    region: "Central",
    shortBlurb: "Beach-city hub and gateway to the Marble Mountains and Ba Na Hills.",
    latitude: 16.0544,
    longitude: 108.2022,
  },
  "hoi-an": {
    slug: "hoi-an",
    name: "Hoi An",
    region: "Central",
    shortBlurb: "UNESCO-listed lantern-lit trading port on the central coast.",
    latitude: 15.8801,
    longitude: 108.338,
  },
  hue: {
    slug: "hue",
    name: "Hue",
    region: "Central",
    shortBlurb: "Imperial capital of the Nguyen dynasty on the Perfume River.",
    latitude: 16.4637,
    longitude: 107.5909,
  },
};

export const CITY_SLUGS = Object.keys(CITIES) as CitySlug[];

export const getCity = (slug: string): CityEntity | undefined =>
  CITIES[slug as CitySlug];

export const isCitySlug = (slug: string): slug is CitySlug => slug in CITIES;
