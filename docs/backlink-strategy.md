# Backlink Acquisition Strategy — daytripsvietnam.com

> Last reviewed: 2026-04. Owner: Joy Nguyen.
> This doc defines the link-building program for the next 12 months. Any
> outreach, guest post, or partnership discussion should reference it so we
> stay consistent on tactics, pace, and guardrails.

## Context

The site has a solid content base (16 city pages · 30 day-trips · 10 pillar guides · 4 itineraries · 24 transport articles · 86 total MDX), clean technical SEO (sitemap, `llms.txt`, IndexNow, full JSON-LD graph), and a credible editorial stance ("independent, no sponsored placements"). What it lacks is **off-site authority** — a new domain with zero referring domains cannot rank for competitive Vietnam-travel queries no matter how good the content is.

Research pulled for this plan (April 2026):

- **Digital PR** is now the #1 link-building tactic (cited by 48.6% of SEOs); 90%+ of effective campaigns are data-led or expert-commentary-led.
- **HARO is effectively dead** (Connectively shut down Dec 2024; relaunched April 2025 but spam-ridden). **Source of Sources (SOS)** — built by HARO's original founder Peter Shankman — is the free replacement. **Featured.com** and **Qwoted** are the paid alternatives.
- Sustainable pace: **2–3 quality links/month**. Chasing volume triggers Google's unnatural-link patterns.
- **Relevance beats authority** — a DR-80 off-topic link is worthless; a DR-25 Vietnam-niche link compounds.

Operating constraints:

- **Named founder bio** (Joy Nguyen) is the highest-yield trust signal and enables all journalist / guest-post tactics. Landed in PR #8.
- **Free-tier tooling only** — SOS + #JournoRequest on X + Google Search Console + manual prospecting. Revisit paid tools (Ahrefs, Featured, Qwoted) only if the free tier plateaus after 6 months.
- **3–5 hrs/week execution budget** — matches the 2–3 links/month industry benchmark.

Intended outcome: **20–30 quality referring domains in 12 months** (DR 20+ OR topically relevant), focused on Vietnam-travel, Southeast Asia, and general travel-editorial publications. No paid links, no reciprocal schemes, no compromise of the "no sponsored placements" brand promise.

---

## Current State — Gaps That Block Outreach

From the April-2026 inventory pass:

| Gap | Impact | Status |
|---|---|---|
| No named author; `/about/` said "editors" | Kills journalist + guest-post pitches (no one to quote) | ✅ Fixed in PR #8 |
| `lib/site.ts` `sameAs: []` (no social handles) | Weakens Org schema; no place for journalists to verify | ✅ Populated in PR #8 — accounts still need to be claimed + seeded |
| No `/press/` or media-kit page | Journalists have no landing page for logos/bio/hi-res | ✅ Shipped in PR #8 |
| Zero compare pages (schema exists, 0 MDX) | Missing the #1 link-bait content type for travel ("Hanoi vs HCMC") | ⏳ Phase 2 — write 6 compare MDX |
| No original data piece | Digital PR in 2026 is 90% data-led; nothing to pitch | ⏳ Phase 2 — Vietnam Travel Cost Index 2026 |
| No RSS feed | Resource pages + curators monitor via RSS | ✅ Shipped in PR #8 |
| No founder photo / hi-res logos bundle | Can't complete guest-post bios or press pitches | ⏳ Prepare asset bundle in `public/press/` |
| Wikimedia-sourced images lack attribution | Legal + journalistic liability | ⏳ Follow-up PR to backfill `heroCredit` (fields landed in PR #8) |

---

## Strategy — Three Tiers of Tactics

**Tier A — do first, highest ROI for a new domain:**

1. **Resource-page link building** (target: 5–8 links/quarter)
2. **Journalist queries via SOS + #JournoRequest** (target: 2–4 links/quarter)
3. **Guest posting** on established travel publications (target: 2–3 links/quarter)
4. **Broken-link building** in Vietnam niche (target: 1–2 links/quarter)

**Tier B — sustainable monthly cadence:**

5. **Expert roundup contributions** (answer "best of Vietnam" calls on other blogs)
6. **Unlinked mention reclamation** (monitor → convert)
7. **Reddit / Thorn Tree / travel forum presence** (referral + occasional links)

**Tier C — opportunistic:**

8. **News-jacking** (visa changes, new airline routes, airport openings)
9. **Scholarship program** — small annual travel-writing scholarship → `.edu` links
10. **Wikipedia citations** where our data pieces fill documented gaps

---

## Phase 1 — Foundation (Weeks 1–2, in-repo work) ✅ Largely complete

All code changes respect `CLAUDE.md`: no `"use client"`, no new heavy deps, no `bookable: true`.

### 1.1 Named founder bio + `/about/` rewrite ✅
- `app/about/page.tsx` rebuilt around Joy Nguyen — photo slot, travel credentials, research approach, email. "No sponsored placements" pledge stays front-and-center.
- `personNode()` in `lib/schema.ts` emits a Person with `name`, `url`, `sameAs`, `jobTitle: "Editor"`.
- `AUTHORS` map in `lib/entities.ts` resolves frontmatter `author` slug → full Person entity. Legacy `author: editors` aliases to `joy-nguyen` so we didn't have to bulk-edit 80+ MDX files.
- `buildPageGraph()` wires the Person into every article's `Article.author` as an `@id` reference.

### 1.2 Press / media-kit page ✅
- `app/press/page.tsx` — founder bio, 3 talking points, 3 quotable lines, brand basics, contact email. Linked from `Footer.tsx` and `sitemap.ts`.
- ⏳ **Still to do:** bundle assets under `public/press/` (logos @ 1x/2x, headshot, 3 editorial photos with captions).

### 1.3 Social presence ⏳
- Handles targeted in `lib/site.ts`:
  ```ts
  sameAs: [
    "https://www.facebook.com/daytripsvietnam",
    "https://www.instagram.com/daytripsvietnam",
    "https://www.linkedin.com/company/daytripsvietnam",
    "https://www.youtube.com/@daytripsvietnam",
  ]
  ```
- ⏳ **Still to do:** claim the four accounts, set bio pointing back to homepage, post 3–5 times on each before any outreach so they don't look dead when journalists verify.

### 1.4 RSS feed ✅
- `app/rss.xml/route.ts` — server-only, `dynamic = "force-static"`, emits RSS 2.0 with the latest 50 posts across all content types. Linked from `<head>` via `alternates` in `app/layout.tsx`.
- Validates against the W3C Feed Validator after deploy.

### 1.5 Image credit infrastructure ⏳
- `baseFields` in `lib/content.ts` accepts optional `heroCredit?: string` and `heroCreditUrl?: string`.
- ⏳ **Still to do:** render the caption below hero images on detail pages when present; backfill the 24 transport + 21 day-trip Wikimedia images with attribution in a dedicated follow-up PR.

**Exit criteria for Phase 1:** ✅ `npm run build` clean; ✅ `/about/` and `/press/` live; ✅ RSS feed prerenders; ✅ Person schema present in View Source on every article. ⏳ Social handles live with 3+ posts each. ⏳ `public/press/` assets bundled.

---

## Phase 2 — Link-Worthy Assets (Weeks 3–6)

Digital PR only works with something to pitch. Produce these assets **before** outreach.

### 2.1 Six compare pages (the cheapest high-yield content type we're missing)

Files to write under `content/compare/` — schema already exists (`compareSchema` in `lib/content.ts`, route at `app/compare/[slug]/page.tsx` — verify the route exists and build a thin template if missing):

| Slug | Target query | Why it earns links |
|---|---|---|
| `hanoi-vs-ho-chi-minh-city` | "hanoi or saigon" | Evergreen top-of-funnel, 10k+/mo search |
| `sapa-vs-ha-giang` | "sapa or ha giang" | Mid-funnel, comparison forums link it |
| `hoi-an-vs-hue` | "hoi an or hue" | Same as above |
| `ha-long-vs-cat-ba-vs-lan-ha` | "ha long bay vs cat ba" | Dominant comparison query in the niche |
| `sleeper-bus-vs-train-vietnam` | "train or bus vietnam" | Transport hub feeder |
| `phu-quoc-vs-nha-trang-vs-da-nang` | "best beach vietnam" | High commercial intent |

Each compare article: 1,500–2,500 words, answer-first summary, decision table ("pick X if …, pick Y if …"), FAQ, 5+ internal links.

### 2.2 One flagship data report — "Vietnam Travel Cost Index 2026"

- New guide at `content/guides/vietnam-travel-cost-index-2026.mdx`.
- Methodology: survey 20–30 real prices across transport (existing transport articles already contain most of this), accommodation (3 bands × 5 cities), food (street / mid / high × 5 cities), attractions (entry fees from official sources).
- Output: one aggregated daily-budget number per backpacker / mid-range / comfort × low / high season. Present as tables — `remark-gfm` is wired (PR #7) so tables render cleanly.
- Cite every price to a named operator, official site, or dated personal observation. **No hallucinated specifics** (CLAUDE.md hard rule).
- Design it to be **updated annually** — the "2026" slug becomes the link asset everyone cites.

### 2.3 Two "best of" roundup pages (optional, Weeks 5–6)

- "15 best day trips from Hanoi" and "12 best day trips from Ho Chi Minh City" — pure aggregation over existing day-trip MDX. Internal-linking hubs; also rank for the roundup queries that journalists land on when pitching Vietnam stories.

**Exit criteria for Phase 2:** 6 compare pages + 1 data report + 2 roundups published, indexed, submitted via IndexNow (`npm run submit-indexnow`).

---

## Phase 3 — Outreach Execution (Week 7+, ongoing)

Weekly cadence within the 3–5 hr budget:

### Weekly loop (≈4 hrs)

- **Mon (1h)** — check SOS digest, `#JournoRequest` / `#PRRequest` on X, reply to any relevant Vietnam / SEA / solo-travel / budget-travel queries. Paste bio + 1 crisp quote + link to the most on-topic page (often a compare, data, or pillar guide).
- **Wed (1.5h)** — resource-page prospecting. Run 5–10 Google dorks (see footprints below), add qualified targets to the tracking sheet, send that day's outreach batch (5–10 personalised emails).
- **Fri (1h)** — guest-post work. Either pitch 2 new publications or draft the current guest post. Target publications in priority order: **Vietnam Coracle**, **Travelfish**, **Matador Network**, **The Broke Backpacker**, **Nomadic Matt**, **Medium pubs** (Globetrotters, Exploring the World).
- **Sat (30m)** — broken-link sweeps on top-20 Vietnam resource pages; reclaim unlinked brand mentions via Google Alerts.

### Prospecting footprints (resource-page building)

```
"vietnam travel" + inurl:resources
"vietnam travel" + "useful links"
"southeast asia" + "travel resources" + site:.edu
"study abroad vietnam" + "resources"
"vietnam itinerary" + "recommended reading"
"travel to vietnam" + inurl:links
"things to do vietnam" + "helpful sites"
```

Qualify each hit: DR ≥ 20 OR topically relevant OR `.edu` / `.gov`; page actively maintained (last-modified < 18 months); our page is genuinely better than what's already listed.

### Outreach templates

Draft 3 reusable templates in `docs/outreach/` (markdown, not shipped to the site — kept in the repo for consistency):

- `resource-page.md` — "Noticed your Vietnam resources page; here's a free, independently-researched [data-report] that might be a fit"
- `broken-link.md` — "Found a broken link on [page]; wrote something covering the same ground if useful"
- `guest-post-pitch.md` — 3 headline options, 1-sentence bio, 2 links to published work on the site

### Tier B — tactics to layer in after month 2

- **Google Alerts** on "daytripsvietnam" + "Joy Nguyen" → unlinked-mention reclamation.
- **Reddit**: build reputation on r/VietnamTravel, r/solotravel, r/backpacking. **No link dropping.** Answer questions thoroughly; eventual mentions come from others.
- **Podcast outreach**: pitch 2–3 travel podcasts/month with a sharp angle (e.g., "how Vietnam's sleeper-bus economy actually works"). Show notes = follow link.

### Tier C — opportunistic (flag in tracking sheet, act when triggered)

- **News-jacking**: monitor Vietnam e-visa changes, new Bamboo / Vietjet routes, airport openings. Publish a take within 24h, pitch 5 journalists who cover the beat.
- **Scholarship program** (month 6+): $500 annual "Vietnam travel-writing scholarship" with a written-essay application → earns `.edu` links via financial-aid directories. Cost: $500/yr + ~5 hrs grading; yield: typically 10–30 `.edu` links.

---

## Tracking & KPIs

- **Single source of truth**: Google Sheet with columns `target_domain | DR | topical_relevance | contact | tactic | pitched_at | replied_at | status | link_url | target_page | anchor_text`.
- **Backlink monitor**: Google Search Console `Links` report + weekly Ahrefs / Ubersuggest free-tier check. (If paid budget ever opens, Ahrefs is the upgrade.)
- **KPIs (rolling 90-day)**:
  - Referring domains gained (target: 6–9 / quarter, ≥ 50% Vietnam/SEA/travel relevant)
  - Average DR of new links (target: ≥ 25)
  - Organic sessions from GSC (leading indicator of link impact)
  - Queries ranking in top 10 (lagging indicator; 3–6 months post-link)
- **Red flags to abort a tactic**: reply rate < 2% on an outreach template (revise), or any link acquired via PBN / Fiverr / paid guest-post package (never — triggers Google penalties).

---

## Critical Files — What to Modify

| File | Purpose | Phase |
|---|---|---|
| `app/about/page.tsx` | About page | ✅ 1 |
| `app/press/page.tsx` | Media kit | ✅ 1 |
| `app/rss.xml/route.ts` | RSS feed | ✅ 1 |
| `app/layout.tsx` | Global head — RSS alternate | ✅ 1 |
| `lib/site.ts` | Brand config — `sameAs` socials | ✅ 1 |
| `lib/schema.ts` | JSON-LD — `personNode()` + wiring | ✅ 1 |
| `lib/content.ts` | Frontmatter — `heroCredit` / `heroCreditUrl` | ✅ 1 |
| `lib/entities.ts` | Entity registry — `AUTHORS` map | ✅ 1 |
| `components/layout/Footer.tsx` | Footer nav — `/press/` + socials | ✅ 1 |
| `app/sitemap.ts` | Sitemap — `/press/` | ✅ 1 |
| `components/content/HeroImage.tsx` (or inline) | Image caption rendering | ⏳ follow-up |
| `content/compare/*.mdx` (× 6) | Compare pages | ⏳ 2 |
| `content/guides/vietnam-travel-cost-index-2026.mdx` | Data report | ⏳ 2 |
| `public/press/` | Press assets (logos, headshot, photos) | ⏳ 1.x |
| `docs/outreach/*.md` (× 3) | Reusable templates | ⏳ 3 |

Reuse, don't reinvent:

- `buildMetadata()` from `lib/seo.ts` for every new route.
- `buildPageGraph()` from `lib/schema.ts` — add `personNode` into the existing flow, don't hand-roll JSON-LD.
- `getAllContent()` / `getByType()` in `lib/content.ts` for the RSS feed + roundups.
- `<AnswerSummary>`, `<Faq>`, `<MdxBody>`, `<Breadcrumbs>` on every new content page.
- Existing IndexNow script (`scripts/submit-indexnow.ts`) — run `npm run submit-indexnow` after each batch.

---

## Guardrails (CLAUDE.md constraints)

- **Never flip `bookable: true`** on any MDX — partnerships don't change this.
- **Never invent facts** in the cost index or compare pages — every price / stat cites a named source or personal observation.
- **No paid link placements** — breaks the "independent, no sponsored" promise and triggers Google's unnatural-link patterns.
- **No reciprocal link schemes** — editorial mentions of partner sites are fine; "you link to me, I link to you" arrangements are not.
- **No client components** added for any of this work — RSS, press page, about page are all Server Components.
- **Merge via squash PRs on branches** — one concern per PR per `CONTRIBUTING.md`.

---

## Verification

### After Phase 1 (shipped)

- `npm run build` passes with no new errors.
- `curl https://daytripsvietnam.com/ | grep -c '"@type":"Person"'` returns ≥ 1.
- `curl https://daytripsvietnam.com/rss.xml` validates at validator.w3.org/feed.
- `/about/` and `/press/` return 200; `/press/` lists downloadable logo + headshot.
- Social profiles live, linked from footer, and visible in homepage `sameAs` JSON-LD.

### After Phase 2

- 9 new content pieces live (6 compare + 1 data report + 2 roundups).
- `npm run submit-indexnow` run; Bing reports all URLs accepted.
- Compare pages show `Article` schema with `about: { @type: Thing, name: "X vs Y" }` (needs a `compareNode` builder in `lib/schema.ts` — verify it exists; if not, add it mirroring `transportNode`).

### After Phase 3 (quarterly review)

- GSC Links report shows ≥ 6 new referring domains in the quarter.
- ≥ 50% of new links from Vietnam / SEA / travel-editorial sources.
- No link from a domain on Google's deindexed list (spot-check 5 random new referrers with `site:<domain>`).
- Organic impressions in GSC trending up month-over-month.

---

## Out of Scope (For Now)

- Paid PR tools (Featured, Qwoted, Ahrefs) — revisit if free-tier yields plateau after 6 months.
- Affiliate / booking infrastructure — explicitly forbidden by CLAUDE.md until Phase 2 of the site roadmap.
- Video / YouTube content production — high ROI for travel but outside the 3–5 hr/week text budget.
- Non-English outreach (Vietnamese travel blogs) — deferred until the English tier is mature.
