import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { CITY_SLUGS } from "./entities";

const CONTENT_DIR = path.join(process.cwd(), "content");

const priceSchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().length(3).default("USD"),
});

const faqItemSchema = z.object({
  q: z.string().min(3),
  a: z.string().min(3),
});

const baseFields = {
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  h1: z.string().min(3).optional(),
  description: z.string().min(50).max(180),
  summary: z.string().min(40).max(600),
  heroImage: z.string().startsWith("/").optional(),
  heroAlt: z.string().optional(),
  author: z.string().default("editors"),
  published: z.string(),
  updated: z.string().optional(),
  tags: z.array(z.string()).default([]),
  faq: z.array(faqItemSchema).default([]),
  related: z.array(z.string()).default([]),
  noindex: z.boolean().default(false),
};

export const citySchema = z.object({
  type: z.literal("city"),
  ...baseFields,
  city: z.enum(CITY_SLUGS as [string, ...string[]]),
});

export const dayTripSchema = z.object({
  type: z.literal("day-trip"),
  ...baseFields,
  city: z.enum(CITY_SLUGS as [string, ...string[]]),
  duration: z.string().regex(/^PT(?:\d+H(?:\d+M)?|\d+M)$/).optional(),
  priceFrom: priceSchema.optional(),
  startLocation: z.string().optional(),
  endLocation: z.string().optional(),
  bookable: z.boolean().default(false),
  bookingUrl: z.string().url().optional(),
});

export const thingToDoSchema = z.object({
  type: z.literal("thing-to-do"),
  ...baseFields,
  city: z.enum(CITY_SLUGS as [string, ...string[]]),
});

export const itinerarySchema = z.object({
  type: z.literal("itinerary"),
  ...baseFields,
  durationDays: z.number().int().positive(),
  cities: z.array(z.string()).default([]),
});

export const guideSchema = z.object({
  type: z.literal("guide"),
  ...baseFields,
});

export const compareSchema = z.object({
  type: z.literal("compare"),
  ...baseFields,
  a: z.string(),
  b: z.string(),
});

export const transportSchema = z.object({
  type: z.literal("transport"),
  ...baseFields,
  // Drives hub grouping: pillar=overview, brand=carrier/operator,
  // route=city-pair, mode=type of transport
  category: z.enum(["pillar", "brand", "route", "mode"]),
  // Brand articles (e.g. Vietnam Airlines, Vietjet, Futa)
  operator: z.string().optional(),
  // Route articles (city-pair). Validated against CitySlug so they can
  // cross-reference destination pages.
  from: z.enum(CITY_SLUGS as [string, ...string[]]).optional(),
  to: z.enum(CITY_SLUGS as [string, ...string[]]).optional(),
  // Primary mode covered in the article
  mode: z
    .enum(["flight", "bus", "train", "car", "motorbike", "ferry", "mixed"])
    .optional(),
  duration: z.string().regex(/^PT(?:\d+H(?:\d+M)?|\d+M)$/).optional(),
  priceFrom: priceSchema.optional(),
});

export const contentSchema = z.discriminatedUnion("type", [
  citySchema,
  dayTripSchema,
  thingToDoSchema,
  itinerarySchema,
  guideSchema,
  compareSchema,
  transportSchema,
]);

export type Frontmatter = z.infer<typeof contentSchema>;
export type CityDoc = z.infer<typeof citySchema>;
export type DayTripDoc = z.infer<typeof dayTripSchema>;
export type ThingToDoDoc = z.infer<typeof thingToDoSchema>;
export type ItineraryDoc = z.infer<typeof itinerarySchema>;
export type GuideDoc = z.infer<typeof guideSchema>;
export type CompareDoc = z.infer<typeof compareSchema>;
export type TransportDoc = z.infer<typeof transportSchema>;

export interface ContentDoc<T extends Frontmatter = Frontmatter> {
  frontmatter: T;
  body: string;
  filepath: string;
}

const readDir = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return readDir(full);
    if (e.isFile() && e.name.endsWith(".mdx")) return [full];
    return [];
  });
};

const parseFile = (filepath: string): ContentDoc => {
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  const parsed = contentSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in ${path.relative(process.cwd(), filepath)}:\n${parsed.error.message}`,
    );
  }
  return { frontmatter: parsed.data, body: content, filepath };
};

let _cache: ContentDoc[] | null = null;

export const getAllContent = (): ContentDoc[] => {
  if (_cache) return _cache;
  const files = readDir(CONTENT_DIR);
  _cache = files.map(parseFile);
  return _cache;
};

export const getByType = <T extends Frontmatter["type"]>(
  type: T,
): Array<ContentDoc<Extract<Frontmatter, { type: T }>>> =>
  getAllContent().filter((d) => d.frontmatter.type === type) as Array<
    ContentDoc<Extract<Frontmatter, { type: T }>>
  >;

export const getCity = (citySlug: string): ContentDoc<CityDoc> | undefined =>
  getByType("city").find((d) => d.frontmatter.city === citySlug);

export const getDayTrip = (
  citySlug: string,
  slug: string,
): ContentDoc<DayTripDoc> | undefined =>
  getByType("day-trip").find(
    (d) => d.frontmatter.city === citySlug && d.frontmatter.slug === slug,
  );

export const getDayTripsByCity = (citySlug: string): Array<ContentDoc<DayTripDoc>> =>
  getByType("day-trip").filter((d) => d.frontmatter.city === citySlug);

export const getThingsByCity = (citySlug: string): Array<ContentDoc<ThingToDoDoc>> =>
  getByType("thing-to-do").filter((d) => d.frontmatter.city === citySlug);

export const getGuide = (slug: string): ContentDoc<GuideDoc> | undefined =>
  getByType("guide").find((d) => d.frontmatter.slug === slug);

export const getItinerary = (slug: string): ContentDoc<ItineraryDoc> | undefined =>
  getByType("itinerary").find((d) => d.frontmatter.slug === slug);

export const getCompare = (pair: string): ContentDoc<CompareDoc> | undefined =>
  getByType("compare").find((d) => d.frontmatter.slug === pair);

export const getTransport = (slug: string): ContentDoc<TransportDoc> | undefined =>
  getByType("transport").find((d) => d.frontmatter.slug === slug);

export const getTransportByCategory = (
  category: TransportDoc["category"],
): Array<ContentDoc<TransportDoc>> =>
  getByType("transport").filter((d) => d.frontmatter.category === category);

export const urlFor = (fm: Frontmatter): string => {
  switch (fm.type) {
    case "city":
      return `/destinations/${fm.city}/`;
    case "day-trip":
      return `/destinations/${fm.city}/day-trips/${fm.slug}/`;
    case "thing-to-do":
      return `/destinations/${fm.city}/things-to-do/${fm.slug}/`;
    case "itinerary":
      return `/itineraries/${fm.slug}/`;
    case "guide":
      return `/guides/${fm.slug}/`;
    case "compare":
      return `/compare/${fm.slug}/`;
    case "transport":
      return `/transport/${fm.slug}/`;
  }
};
