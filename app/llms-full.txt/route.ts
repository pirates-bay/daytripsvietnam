import { SITE } from "@/lib/site";
import { getAllContent, urlFor } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const docs = getAllContent().filter((d) => !d.frontmatter.noindex);

  const parts = docs.map((d) => {
    const url = `${SITE.url}${urlFor(d.frontmatter)}`;
    return [
      `# ${d.frontmatter.title}`,
      `URL: ${url}`,
      `Type: ${d.frontmatter.type}`,
      `Updated: ${d.frontmatter.updated ?? d.frontmatter.published}`,
      "",
      `Summary: ${d.frontmatter.summary}`,
      "",
      d.body.trim(),
      "",
      "---",
      "",
    ].join("\n");
  });

  const body = `# ${SITE.name} — full content index\n\n${SITE.description}\n\n---\n\n${parts.join("\n")}`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
