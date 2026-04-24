import { SITE } from "@/lib/site";
import { getAllContent, urlFor } from "@/lib/content";
import { getAuthor } from "@/lib/entities";

// RSS 2.0 feed of the latest 50 published pages across every content type.
// Resource-page curators, link-monitoring tools, and a subset of journalists
// watch RSS — it's cheap to emit and every subscription is a free discovery
// channel. Mirrored pattern from app/sitemap.ts: iterate getAllContent(),
// drop noindex, sort by updated desc.

export const dynamic = "force-static";

// Minimal XML escape for the five characters that matter in RSS <![CDATA[]]>
// isn't enough on its own because some aggregators don't honour it — belt and
// braces: escape everywhere we interpolate text into attributes or elements.
const xmlEscape = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toRfc822 = (iso: string): string => new Date(iso).toUTCString();

export function GET() {
  const items = getAllContent()
    .filter((d) => !d.frontmatter.noindex)
    .sort((a, b) => {
      const da = new Date(
        a.frontmatter.updated ?? a.frontmatter.published,
      ).getTime();
      const db = new Date(
        b.frontmatter.updated ?? b.frontmatter.published,
      ).getTime();
      return db - da;
    })
    .slice(0, 50);

  const channelLastBuild =
    items.length > 0
      ? toRfc822(items[0].frontmatter.updated ?? items[0].frontmatter.published)
      : new Date().toUTCString();

  const rssItems = items
    .map((d) => {
      const fm = d.frontmatter;
      const link = `${SITE.url}${urlFor(fm)}`;
      const pubDate = toRfc822(fm.updated ?? fm.published);
      const author = getAuthor(fm.author);
      // `author` in RSS 2.0 must be an email; we don't publish one per
      // author, so use dc:creator for the human name and leave <author> off.
      return `    <item>
      <title>${xmlEscape(fm.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${xmlEscape(fm.description)}</description>
      <dc:creator>${xmlEscape(author.name)}</dc:creator>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xmlEscape(SITE.name)}</title>
    <link>${SITE.url}</link>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(SITE.description)}</description>
    <language>en</language>
    <lastBuildDate>${channelLastBuild}</lastBuildDate>
    <generator>Day Trips Vietnam / Next.js</generator>
${rssItems}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
