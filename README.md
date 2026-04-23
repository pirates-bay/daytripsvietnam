# daytripsvietnam.com

Top travel info site for Vietnam day trips, city tours, and itineraries. Built for SEO + AEO (AI answer engines) from day one.

## Stack

- **Next.js 15** (App Router, static generation)
- **MDX** content in `/content/**`, typed via Zod
- **Tailwind CSS** with `@tailwindcss/typography`
- **Vercel** hosting

## Commands

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm build            # static build
pnpm start            # serve built site
pnpm typecheck
pnpm lint
pnpm validate-content # lint MDX frontmatter
```

## Adding content

Create an MDX file under `/content/<type>/…` with valid frontmatter (see `lib/content.ts` for the Zod schema). URLs are derived from the file path + `slug` field.

## Architecture

See `/Users/eric/.claude/plans/i-bought-a-new-reflective-fountain.md` for the full build plan.

- `app/` — routes (Server Components, statically rendered)
- `content/` — MDX source of truth
- `lib/` — content loader, JSON-LD builders, SEO helpers
- `components/` — presentational + SEO components
- `public/` — static assets

Every content page emits JSON-LD (`TouristTrip`, `Article`, `FAQPage`, `BreadcrumbList`, etc.), a canonical URL, OG tags, and ships with zero render-blocking JS. `TouristTrip` + `Offer` are already in place so day trips can be made bookable in phase 2 without URL changes.

## AEO

- `/llms.txt` + `/llms-full.txt` for AI crawlers
- Answer-first `summary` on every page, rendered visually + fed into `description`, OG, and `SpeakableSpecification`
- FAQ sections emit `FAQPage` schema
- Comparison pages under `/compare/[a]-vs-[b]/`
