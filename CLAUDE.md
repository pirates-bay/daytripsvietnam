# CLAUDE.md — Agent instructions for daytripsvietnam.com

These instructions apply to every Claude Code session working on this repo. They exist so that every teammate's agent behaves consistently.

## What this project is

daytripsvietnam.com is a **content-first static site** built with Next.js 15 (App Router) + MDX + Tailwind, deployed to Vercel. Goal: rank #1 and be cited by AI answer engines for queries about Vietnam day trips, city tours, and itineraries.

- **Content lives in `/content/**/*.mdx`** with Zod-validated frontmatter (`lib/content.ts`).
- **Every content page is statically pre-rendered.** No client-side rendering of content.
- **SEO + AEO are the product.** Schema, metadata, internal linking, answer-first copy, FAQs, `speakable` markup — these are not optional polish.
- **Phase 1 is content + SEO.** Commerce (booking) is deferred but the schema is prepared (`TouristTrip` + `Offer`, `bookable: false` flag).

Read `README.md` and the plan at `/Users/eric/.claude/plans/i-bought-a-new-reflective-fountain.md` for full context.

## Workflow — always

1. **Never commit to `main` directly.** Branch first: `git checkout -b <type>/<desc>` (see `CONTRIBUTING.md` for types).
2. **One concern per branch / PR.** Don't bundle unrelated changes.
3. **Run the build before declaring done:** `npm run build`. If it fails, fix it; don't paper over with `// @ts-ignore` or disabling ESLint rules.
4. **For UI changes, verify on the dev server** using the preview tools. Don't claim success without visual confirmation.
5. **For content changes, re-check the rendered page** for: H1 uniqueness, answer summary visible, FAQ accordion present, JSON-LD emitted (`curl <url> | grep -c application/ld+json` ≥ 2).

## Hard rules — do not violate

- **Do not flip `bookable: true` on any MDX file.** Booking infrastructure isn't built. Leaving it false until phase 2 is a load-bearing guarantee.
- **Do not invent facts.** Prices, travel times, operating hours, visa rules — if you can't verify from an authoritative source, write conservatively ("around", "typically") or omit. AI engines penalize hallucinated specifics.
- **Do not introduce client components** (`"use client"`) unless the feature genuinely requires interactivity (e.g. a modal, a search box). Default is Server Components.
- **Do not add runtime dependencies casually.** Every KB of JS on the critical path costs LCP. If you need a library, justify it in the PR.
- **Do not edit `next-env.d.ts`** — it's auto-generated.
- **Do not disable ESLint rules or TS strict** to make a build pass. Fix the underlying issue.
- **Do not regenerate or bulk-edit MDX files** without explicit user approval. Programmatic content generation is a dedicated, reviewed workflow.
- **Entity names use `lib/entities.ts`.** "Ha Long Bay" — not "Halong Bay", not "Ha-Long Bay". Add to `entities.ts` if a new place is needed.

## Content rules (if writing MDX)

Every content page must have, in the frontmatter:

- `title`, `description` (150–160 chars), `summary` (40–60 words — the answer-first paragraph that renders at the top and feeds `speakable` schema + OG).
- `heroImage`, `heroAlt`, `author`, `published`, `updated`.
- `faq` — 5 to 10 Q&As. Real questions travelers ask, not SEO filler.
- `related` — 3+ internal slugs to create link equity.

**Day trips additionally need:** `duration` (ISO 8601 like `PT10H`), `priceFrom: {amount, currency}`, `startLocation`, `endLocation`, `bookable: false`.

**In the body:**
- Lead with the answer. First paragraph resolves the query.
- H2s are answerable sub-questions. H3s for supporting detail.
- Link to at least 3 other pages on the site (cities, related day trips, guides).
- No thin sections. If you can't say something useful under a heading, remove the heading.

## Performance rules

- Target: LCP ≤ 1.8s mobile, JS ≤ 80 KB gzip on content pages, Lighthouse ≥ 95 Performance/SEO/Accessibility.
- Use `next/image` for every image (or the MDX `<Image>` wrapper). Set `sizes`. Only `priority` on the hero.
- Fonts: `next/font` only, `display: swap`, preload the ones used above the fold.
- Don't add analytics scripts to the critical path. Defer to `afterInteractive` or later.

## SEO / AEO rules

- Every page calls `buildMetadata(...)` from `lib/seo.ts` — canonical, OG, Twitter all flow through it.
- Every page type has a matching JSON-LD builder in `lib/schema.ts`. If you invent a new page type, add a builder; don't hand-roll JSON-LD in the route.
- Every non-home page renders a `<Breadcrumbs>` (visual + schema).
- The `summary` paragraph must carry `data-speakable` (already handled by `<AnswerSummary>` — use that component, don't re-implement).
- FAQ rendering must go through `<Faq>` — it emits `FAQPage` schema automatically.

## Git / Vercel quirks

- **Vercel rejects deploys from unauthorized commit authors.** The project is linked to a personal Vercel account (`ericnguyen1214@gmail.com`). Local `git config user.email` in this repo is set to that address. Don't change it without updating Vercel team membership.
- **No force-pushes to `main` ever.** Use new commits.
- **Merge via squash** to keep `main` linear.

## When unsure

Ask. Cheap clarifications beat expensive rollbacks. If the user's instruction conflicts with these rules, surface the conflict rather than silently picking a side.
