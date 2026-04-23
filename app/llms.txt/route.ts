import { SITE } from "@/lib/site";
import { getAllContent, urlFor } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const docs = getAllContent().filter((d) => !d.frontmatter.noindex);

  const sections: Record<string, string[]> = {
    Destinations: [],
    "Day Trips": [],
    Itineraries: [],
    Guides: [],
    Comparisons: [],
  };

  for (const d of docs) {
    const url = `${SITE.url}${urlFor(d.frontmatter)}`;
    const line = `- [${d.frontmatter.title}](${url}): ${d.frontmatter.description}`;
    switch (d.frontmatter.type) {
      case "city":
        sections.Destinations.push(line);
        break;
      case "day-trip":
      case "thing-to-do":
        sections["Day Trips"].push(line);
        break;
      case "itinerary":
        sections.Itineraries.push(line);
        break;
      case "guide":
        sections.Guides.push(line);
        break;
      case "compare":
        sections.Comparisons.push(line);
        break;
    }
  }

  const body =
    `# ${SITE.name}\n\n` +
    `> ${SITE.description}\n\n` +
    Object.entries(sections)
      .filter(([, lines]) => lines.length > 0)
      .map(([heading, lines]) => `## ${heading}\n\n${lines.join("\n")}\n`)
      .join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
