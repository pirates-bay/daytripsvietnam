import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";

export interface SeoInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
}

export const buildMetadata = (input: SeoInput): Metadata => {
  const url = absoluteUrl(input.path);
  const image = absoluteUrl(input.image ?? SITE.defaultOgImage);
  // Root layout sets a title template "%s | SITE.name"; pass the raw title
  // here and let the template add the suffix. If the title already contains
  // the site name (e.g. homepage), use `absolute` to bypass the template.
  const title = input.title.includes(SITE.name)
    ? { absolute: input.title }
    : input.title;
  const ogTitle = typeof title === "string" ? `${title} | ${SITE.name}` : title.absolute;

  return {
    metadataBase: new URL(SITE.url),
    title,
    description: input.description,
    alternates: { canonical: url },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      type: input.type ?? "website",
      url,
      siteName: SITE.name,
      title: ogTitle,
      description: input.description,
      locale: SITE.locale,
      images: [{ url: image, alt: input.imageAlt ?? input.title }],
      ...(input.type === "article" && {
        publishedTime: input.publishedTime,
        modifiedTime: input.modifiedTime,
        authors: input.author ? [input.author] : undefined,
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter,
      title: ogTitle,
      description: input.description,
      images: [image],
    },
  };
};
