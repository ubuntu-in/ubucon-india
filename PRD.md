# UbuCon India — Website PRD

_Last updated: 2026-07-22_

## 1. Summary

Static hub site for **all UbuCon India editions** — past, current, and
future. Built around the upcoming **UbuCon India 2026** (Bengaluru,
14–15 Nov 2026) but catalogues every edition in one place. Sleek, minimal,
config-driven. Deploys to GitHub Pages at `https://ubucon.org/india`.

## 2. Goals & non-goals

**Goals**
- Sleek, minimal, low-text, easy to navigate.
- Event details (schedule, speakers, sponsors) driven by YAML config, not
  hardcoded in templates.
- Popular stack, low barrier for community contributors.
- Strict adherence to **Vanilla Framework** (Canonical's design system) —
  no custom design system. ("Strict vanilla" = Vanilla Framework, _not_
  vanilla JS.)
- Ship zero JS by default; light reactivity only where needed.

**Non-goals**
- No backend / server. Static hosting only.
- No custom ticketing integration (KonfHub link-out only).
- No site search.
- No SPA / client-side routing.
- Repo/deploy setup (git init, Pages enablement) — handled separately.

## 3. Stack (as built)

| Concern | Choice | Notes |
|---|---|---|
| Generator | **Astro 7** | Static output, zero JS default. |
| Design system | **Vanilla Framework 4** (Sass) | `@import 'vanilla-framework'` in `global.scss`. Vanilla 4 is still `@import`-based; the `silenceDeprecations` in `astro.config.mjs` is correct, not a workaround to remove. |
| Interactivity | **Svelte 5 islands** | `@astrojs/svelte` installed. _(Note: `website.md` still says Preact — stale; actual stack is Svelte. No islands exist yet.)_ |
| Content | **Astro Content Collections (YAML)** | Zod-validated in `src/content.config.ts`; bad/missing field fails the build. |
| Icons | **bootstrap-icons**, inlined | `Icon.astro` reads SVG at build, inherits `currentColor`. |
| Package manager | **bun** | `bun.lock` committed. |
| Deploy | GitHub Actions → Pages | `.github/workflows/deploy.yml`, `base: /india`. |

Internal links/assets route through `url()` in `src/lib/url.ts` to carry the
`/india` base path.

## 4. Current status

**Done**
- Astro project scaffolded, builds clean (`bun run build`).
- Base layout: `Base.astro` (head/meta/canonical/skip-link) + `Nav.astro`
  (zero-JS checkbox mobile toggle) + `Footer.astro`.
- Content schemas defined for `event`, `speakers`, `schedule`, `sponsors`,
  `lookback`.
- **Home** page (`index.astro`) — hero, highlights, 2025 look-back, call for
  speakers, sponsors strip.
- **About** page (`about.astro`) — about + mission.
- Deploy workflow written.

**Placeholder / stub**
- `speakers/placeholder.yaml`, `schedule.yaml`, `sponsors.yaml` = one dummy
  entry each.
- Event `venue: To be announced`.

**Needs rework**
- **Nav is not yet context-aware.** Currently flat (Home + Events + About).
  Once per-edition pages exist, the nav must switch context: top-level pages
  get the global nav; pages inside an edition's URL space get an edition nav
  (Home, Speakers, Schedule, Sponsors, Venue). See §6.
- **Speakers / schedule / sponsors are edition-agnostic.** Current schemas
  have no `edition` field. They need one so per-edition pages can filter to
  their own data. See §8.

## 5. Scope — pages

All pages in scope. Home + About + Events exist and get polish passes; the
per-edition pages (Speakers, Schedule, Sponsors, Venue) and the edition landing
page get built.

### 5.1 Top-level pages

| Page | Route | State | Work |
|---|---|---|---|
| Home | `/` | Built | Wire Register CTA to `ticketUrl` (link-out). Remove Search nav item. |
| About | `/about` | Built | Polish, ensure Vanilla-only styling. |
| Events | `/events` | Built | Lists all UbuCon India editions from `event.yaml`. Each entry a card with edition, dates, city, link to `/events/[slug]`. Sorted newest-first. |

### 5.2 Per-edition pages

Each edition gets its own URL namespace under `/events/[slug]/`. The slug is
the YAML key from `event.yaml` (e.g. `india-2026`, `india-2025`).

| Page | Route | Scope | Work |
|---|---|---|---|
| Edition home | `/events/[slug]` | One per edition | Edition-specific landing: hero with dates/city/tagline, Register CTA (if upcoming), highlights link (if past). Identical structure, different data per edition. |
| Speakers | `/events/[slug]/speakers` | One per edition | Grid from `speakers/*.yaml` filtered by `edition` field. Featured first. Graceful "announced after CFP" empty state. |
| Schedule | `/events/[slug]/schedule` | One per edition | Timetable from `schedule.yaml` filtered by `edition` field. Each session links its `speaker` reference. Graceful empty state. |
| Sponsors | `/events/[slug]/sponsors` | One per edition | Grouped by tier (`platinum`/`gold`/`silver`/`community`) from `sponsors.yaml` filtered by `edition`. |
| Venue | `/events/[slug]/venue` | One per edition | Shows venue info from `event.yaml` for that edition. "To be announced" until set. Travel info later. |

The current Home page (`/`) always features the upcoming edition (2026). Past
editions are discovered through `/events`.

## 6. Features / decisions

- **Ticketing:** KonfHub **link-out only**. Register CTAs → `event.ticketUrl`.
  No embed script, no island.
- **Search:** dropped. ~~Remove the nav item.~~ **Done** — no Search item in nav.
- **Navigation (context-aware):** The nav bar changes based on where you are.

  **Top-level pages** (`/`, `/about`, `/events`):
  - Home · Events · About

  **Inside an edition** (`/events/[slug]/…`):
  - Home · Speakers · Schedule · Sponsors · Venue
  - "Home" always links to `/`, not the edition landing — it's the global
    home, giving users a reliable escape hatch.

  Built strictly on Vanilla's `p-navigation` (light, sticky,
  `p-navigation__row--25-75`, `p-navigation__tagged-logo` with the UbuCon
  India logo). Mobile toggle uses Vanilla's zero-JS `:target` mechanism
  (`p-navigation__toggle--open` → `#navigation`,
  `p-navigation__toggle--close` → `#`) — no checkbox hack, no JS, no custom
  `c-nav__*` classes.

  Implementation: a single `Nav.astro` reads `Astro.url.pathname` to detect
  whether we're inside `/events/[slug]/` and swaps the link list accordingly.
  No Svelte island needed — this is a build-time static decision per page.
- **Call for speakers:** links to `event.cfpUrl`; show `cfpDeadline`.
- **Reactivity:** none required for current scope. Add a Svelte island only if
  a concrete interactive need appears.

## 7. Requirements

- **Accessibility:** skip-link (present), semantic landmarks, `aria-current`
  on active nav, alt text, keyboard-operable nav. Meet Vanilla's a11y baseline.
- **Responsive:** mobile-first; nav uses Vanilla's zero-JS `:target` collapse
  (breakpoint per Vanilla `$breakpoint-navigation-threshold`, ~900px).
- **SEO:** per-page `title`/`description`, canonical URL (present in `Base.astro`).
- **Build integrity:** all internal links via `url()`; content validated by Zod;
  build must stay green.
- **Content editing:** contributors edit YAML under `src/content/`, never
  templates.
- **Buttons (Vanilla guidelines):**
  - Use Vanilla's `p-button--positive` (green) for the **primary** CTA — the
    one main action per card/section (e.g. Register, Submit proposal).
  - Use Vanilla's default `p-button` (black border on white) for the
    **secondary** action (e.g. Learn More, View Highlights). Do **not** use
    `p-button--base` for this — the default `p-button` is the black-bordered
    secondary, matching the hero's Learn More.
  - **No border radius on buttons.** Vanilla ships square buttons by default;
    never add `border-radius` to `p-button*`. (Cards and panels may keep
    rounded corners — this rule is buttons only.)
  - One `p-button--positive` per card/section; pair it with at most one
    `p-button` secondary. Avoid brand-coloured buttons (`p-button--brand` is
    deprecated since Vanilla 4.9).

## 8. Multi-edition hub

The site catalogues all UbuCon India editions, not just 2026. The `event` content
collection is a multi-entry YAML file (not a singleton), keyed by edition slug
(e.g. `india-2024`, `india-2025`, `india-2026`). Each entry carries the same
schema — Zod validates every field at build.

### 8.1 URL structure

```
/                         — Global home (features upcoming edition)
/about                    — About the conference
/events                   — List of all editions
/events/[slug]            — Edition landing page (hero, dates, CTAs)
/events/[slug]/speakers   — Speakers for that edition
/events/[slug]/schedule   — Schedule for that edition
/events/[slug]/sponsors   — Sponsors for that edition
/events/[slug]/venue      — Venue for that edition
```

Each edition gets its own namespace under `/events/[slug]/`. The global home
(`/`) always features the upcoming edition (2026). Past editions are discovered
through `/events`.

### 8.2 Events listing page (`/events`)

- Lists all editions from `getCollection('event')`, sorted by `startDate`
  descending (newest first).
- Each edition renders as a card: name, date range, city, eyebrow/tagline.
- Each card links to `/events/[slug]` (the edition landing).
- Empty state (no editions in YAML) shows a graceful "No events yet" message.

### 8.3 Edition landing page (`/events/[slug]`)

- Dynamic route `src/pages/events/[slug].astro` using `getStaticPaths()` with
  all event entries.
- Shows that edition's hero: name, dates, city, tagline, intro.
- CTAs depend on edition type:
  - **Upcoming (e.g. 2026):** "Register Now" → `ticketUrl`,
    "View Speakers" → `/events/[slug]/speakers`, etc.
  - **Past (e.g. 2025, 2024):** "Highlights" → `highlightsUrl`.
- Nav switches to edition context (Home · Speakers · Schedule · Sponsors ·
  Venue) on this page and all sub-pages.

### 8.4 Per-edition content filtering

Speakers, schedule, and sponsors each need an `edition` field so per-edition
pages can filter. Current schemas are edition-agnostic — they need updating:

- **`speakers` schema:** Add `edition: z.string()` — references the event slug
  (e.g. `"india-2026"`). Speakers can appear in multiple editions (repeat the
  entry per edition, or use a `editions: z.array(z.string())` approach).
- **`schedule` schema:** Add `edition: z.string()`.
- **`sponsors` schema:** Add `edition: z.string()`.

Each per-edition page fetches via `getCollection('speakers', ({ data }) => data.edition === slug)`.
Graceful empty state (e.g. "Speakers will be announced after the CFP closes") when
no entries match.

### 8.5 Schema changes

- No loader change — `file('src/content/event.yaml')` already treats top-level
  YAML keys as entry IDs. Adding new keys creates new entries automatically.
- `ticketUrl` becomes optional (`z.string().url().optional()`) — past editions
  don't have live ticketing.
- `cfpUrl` and `cfpDeadline` remain optional (already were).
- Add `highlightsUrl` field (`z.string().url().optional()`) for linking to
  past-edition recaps/photo albums.

### 8.6 Content editing

- To add a new past edition: add a new top-level key in `event.yaml` (e.g.
  `india-2024`), fill all required fields, omit `ticketUrl`/`cfpUrl` if
  N/A, and provide `highlightsUrl` for the recap link.
- To add content for that edition: add speaker/schedule/sponsor entries with
  the matching `edition` value.
- The Events page and all per-edition pages rebuild automatically — no
  template changes needed.

## 9. Content to source (owners TBD)

- Real speakers (after CFP closes 2026-09-30).
- Real schedule/sessions.
- Real sponsors + logos.
- Venue details once announced.
- 2025 look-back copy/media. **Now inline on `event.yaml`** (see §8.5).
  To populate: add `stats`, `gallery`, and `highlightsUrl` to the `india-2025`
  entry in `src/content/event.yaml` and drop photos in `public/img/2025/`.
  No separate `lookback` collection — the home page reads the latest past
  edition's entry automatically.

## 10. Milestones

1. **M1 — Cleanup:** remove Search nav item; wire Register/CFP CTAs to config
   URLs; correct `website.md` Preact→Svelte note; add Events page + nav entry.
2. **M2 — Per-edition pages:** add `edition` field to speakers/schedule/sponsors
   schemas; build dynamic routes `/events/[slug]` (landing) and
   `/events/[slug]/speakers`, `/events/[slug]/schedule`,
   `/events/[slug]/sponsors`, `/events/[slug]/venue`; implement context-aware
   nav; graceful empty states throughout.
3. **M3 — Polish:** responsive/a11y pass, meta per page, consistent Vanilla
   patterns across all pages.
4. **M4 — Content load:** replace placeholder YAML with real data as it lands.

## 11. Open questions

- Venue announcement date?
- Owner for speaker/schedule/sponsor content entry?
- 2025 look-back assets available?
