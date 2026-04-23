import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllContent, urlFor } from "@/lib/content";

const STATIC_PATHS = [
  "/",
  "/destinations/",
  "/itineraries/",
  "/guides/",
  "/about/",
  "/contact/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries = STATIC_PATHS.map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1.0 : 0.6,
  }));

  const contentEntries = getAllContent()
    .filter((d) => !d.frontmatter.noindex)
    .map((d) => ({
      url: `${SITE.url}${urlFor(d.frontmatter)}`,
      lastModified: new Date(d.frontmatter.updated ?? d.frontmatter.published),
      changeFrequency: "monthly" as const,
      priority: d.frontmatter.type === "day-trip" ? 0.9 : 0.7,
    }));

  return [...staticEntries, ...contentEntries];
}
