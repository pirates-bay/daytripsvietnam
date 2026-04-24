# Contributing

Thanks for helping build daytripsvietnam.com. This site is a content-first, static-rendered Next.js app, and the bar is: **every merged change should either add real value to a traveler or improve SEO/AEO/performance**. Nothing else belongs on `main`.

## Ground rules

- **Never push directly to `main`.** Always branch + PR, even for one-line fixes.
- **One concern per PR.** A content addition, a component fix, and a config tweak are three PRs.
- **Keep PRs small.** Under ~400 lines changed is the sweet spot. If you're adding 10 city pages, that's 10 PRs (or one bulk content PR, no code changes).
- **Write the commit message for someone reading `git log` a year from now.** Why, not what.

## Branch naming

Format: `<type>/<short-kebab-description>`

| Type       | Use for                                            |
| ---------- | -------------------------------------------------- |
| `content/` | New or updated MDX (cities, day trips, guides…)    |
| `feat/`    | New functionality, components, routes              |
| `fix/`     | Bug fixes                                          |
| `seo/`     | SEO/AEO schema, metadata, sitemap changes          |
| `perf/`    | Performance work                                   |
| `chore/`   | Tooling, deps, config, CI                          |

Examples: `content/hanoi-weekend-guide`, `feat/search-modal`, `fix/faq-schema-escaping`, `seo/breadcrumb-for-compare`, `perf/hero-image-preload`.

## PR workflow

1. Pull latest `main`: `git pull origin main`
2. Branch: `git checkout -b content/my-new-guide`
3. Commit as you go. Use the present tense: `Add Hanoi weekend itinerary guide`.
4. Push: `git push -u origin <branch>`
5. Open a PR against `main`. Vercel auto-creates a preview URL — paste it in the PR description.
6. Fill out the PR template (below).
7. Request review from one teammate. Address comments with new commits (don't force-push after review starts).
8. **Squash and merge** once approved and the preview looks right.

### PR description template

```md
## What
<1–2 sentences>

## Why
<why does this improve the site for travelers / search / AI answers?>

## Preview
<Vercel preview URL>

## Checklist
- [ ] I ran `npm run build` locally and it succeeded
- [ ] Any new MDX has valid frontmatter (Zod will fail the build otherwise)
- [ ] New pages have: H1, 40–60 word summary, FAQ, internal links
- [ ] Images use `next/image` (or go through the MDX `<Image>` wrapper)
- [ ] No new client components unless the interaction requires it
```

## Content rules (MDX)

Content pages are the product. They must be written to rank AND to be cited by AI answer engines.

- **Every content page needs:** `title`, `description` (150–160 chars), `summary` (40–60 words, answer-first), `heroImage`, `heroAlt`, `author`, `published`, `updated`, `faq` (5–10 Q&As), `related` (3+ internal slugs).
- **Day trips additionally need:** `duration` (ISO 8601, e.g. `PT10H`), `priceFrom` (`{amount, currency}`), `startLocation`, `endLocation`, `bookable: false` (until Phase 2).
- **Entity names must be canonical** — use the names in `lib/entities.ts`. "Ha Long Bay" not "Halong Bay". Don't invent new spellings; add to `entities.ts` if a new place is needed.
- **No invented facts.** Prices, hours, and travel times must be verifiable. If you can't verify, omit or say "expect roughly…".
- **No stock photos if you can help it.** Original photos build E-E-A-T and rank better.
- **`bookable: false` stays false** until the booking system ships. Don't flip it ahead of time.

## Commits

- Present tense, sentence case, no trailing period: `Add Sapa trekking day trip`
- Don't reference PR numbers or "this commit" — write for someone reading `git log`.
- Keep the subject under 70 chars. Use the body for the why.

## Deploys

- `main` auto-deploys to production on every merge via the Vercel GitHub integration.
- Every PR gets a preview deployment. **Review on the preview URL, not locally.**
- If a deploy fails, the culprit PR should be reverted, not patched on `main`.

## Git author email

Vercel rejects deploys from commit authors whose email isn't registered on the Vercel team. Before your first commit:

```bash
git config user.email "<email on your Vercel account>"
```

If you're not sure, ask the repo owner.

## Questions

Open a draft PR or a GitHub issue. Don't DM — we want the answer archived for the next person.
