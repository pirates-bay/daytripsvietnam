export type CitySlug =
  | "hanoi"
  | "ninh-binh"
  | "ha-long-bay"
  | "sapa"
  | "ho-chi-minh-city"
  | "da-nang"
  | "hoi-an"
  | "hue"
  | "phu-quoc"
  | "da-lat"
  | "mui-ne"
  | "nha-trang"
  | "phong-nha"
  | "mekong-delta"
  | "ha-giang"
  | "cat-ba";

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
  "phu-quoc": {
    slug: "phu-quoc",
    name: "Phu Quoc",
    region: "South",
    shortBlurb: "Vietnam's largest tropical island — white-sand beaches, snorkelling, and resort stays.",
    latitude: 10.2270,
    longitude: 103.9638,
  },
  "da-lat": {
    slug: "da-lat",
    name: "Da Lat",
    region: "Central",
    shortBlurb: "Cool-climate mountain town of pine forests, French colonial villas, and coffee farms.",
    latitude: 11.9404,
    longitude: 108.4583,
  },
  "mui-ne": {
    slug: "mui-ne",
    name: "Mui Ne",
    region: "South",
    shortBlurb: "Red and white sand dunes, kitesurfing beaches, and fishing-village seafood.",
    latitude: 10.9446,
    longitude: 108.2880,
  },
  "nha-trang": {
    slug: "nha-trang",
    name: "Nha Trang",
    region: "Central",
    shortBlurb: "South-central beach resort with island-hopping boat tours and Cham towers.",
    latitude: 12.2388,
    longitude: 109.1967,
  },
  "phong-nha": {
    slug: "phong-nha",
    name: "Phong Nha",
    region: "Central",
    shortBlurb: "UNESCO karst park with the world's largest caves and jungle river trails.",
    latitude: 17.5953,
    longitude: 106.2839,
  },
  "mekong-delta": {
    slug: "mekong-delta",
    name: "Mekong Delta",
    region: "South",
    shortBlurb: "Fruit orchards, floating markets, and stilt-house homestays on Vietnam's rice-bowl delta.",
    latitude: 10.0452,
    longitude: 105.7469,
  },
  "ha-giang": {
    slug: "ha-giang",
    name: "Ha Giang",
    region: "North",
    shortBlurb: "The Ha Giang Loop — jagged limestone mountains and hill-tribe villages on Vietnam's Chinese border.",
    latitude: 22.8241,
    longitude: 104.9784,
  },
  "cat-ba": {
    slug: "cat-ba",
    name: "Cat Ba Island",
    region: "North",
    shortBlurb: "Largest island in Ha Long Bay — hiking, kayaking, and cheaper base for Lan Ha Bay cruises.",
    latitude: 20.7234,
    longitude: 107.0430,
  },
};

export const CITY_SLUGS = Object.keys(CITIES) as CitySlug[];

export const getCity = (slug: string): CityEntity | undefined =>
  CITIES[slug as CitySlug];

export const isCitySlug = (slug: string): slug is CitySlug => slug in CITIES;
