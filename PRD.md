# UbuCon India 2026 — Website PRD

_Last updated: 2026-07-22_

## 1. Summary

Static marketing + information site for **UbuCon India 2026** (Bengaluru,
14–15 Nov 2026). Sleek, minimal, config-driven. Deploys to GitHub Pages at
`https://ubucon.org/india`.

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
- Nav links for Schedule / Speakers / Venue / Sponsors point at `#`.
  **(Removed)** — these are event-specific, not top-level nav. The global
  nav now lists only Home + About, built strictly on Vanilla's `p-navigation`
  pattern (`is-light`, `is-sticky`, `p-navigation__row--25-75`,
  `p-navigation__tagged-logo`, zero-JS `:target` mobile toggle via
  `p-navigation__toggle--open` / `--close`). Search nav item removed
  (see §6).
- Event `venue: To be announced`.

## 5. Scope — pages

All pages in scope. Home + About exist and get polish passes; the four stubs
get built.

| Page | State | Work |
|---|---|---|
| Home | Built | Wire Register CTA to `ticketUrl` (link-out). Remove Search nav item. |
| About | Built | Polish, ensure Vanilla-only styling. |
| Speakers | Stub | Grid from `speakers/*.yaml`; featured first. Graceful "announced after CFP" empty state. |
| Schedule | Stub | Timetable from `schedule.yaml`; each session links its `speaker` reference. Graceful empty state. |
| Sponsors | Stub | Full page grouped by tier (`platinum`/`gold`/`silver`/`community`) from `sponsors.yaml`. |
| Venue | Stub | Basic page; shows "To be announced" until venue set. Travel info later. |

## 6. Features / decisions

- **Ticketing:** KonfHub **link-out only**. Register CTAs → `event.ticketUrl`.
  No embed script, no island.
- **Search:** dropped. ~~Remove the nav item.~~ **Done** — no Search item in nav.
- **Navigation (global):** top-level nav = Home + About only. Schedule,
  Speakers, Venue, Sponsors are event-specific pages, not global nav items.
  Built strictly on Vanilla's `p-navigation` (light, sticky,
  `p-navigation__row--25-75`, `p-navigation__tagged-logo`). Mobile toggle uses
  Vanilla's zero-JS `:target` mechanism (`p-navigation__toggle--open` →
  `#navigation`, `p-navigation__toggle--close` → `#`) — no checkbox hack, no
  custom JS, no custom `c-nav__*` classes.
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

## 8. Content to source (owners TBD)

- Real speakers (after CFP closes 2026-09-30).
- Real schedule/sessions.
- Real sponsors + logos.
- Venue details once announced.
- 2025 look-back copy/media. **Schema ready** (`lookback` collection in
  `src/content/lookback.yaml`). To load real data: edit the YAML (stats,
  gallery image paths, `highlightsUrl`) and drop photos in
  `public/img/2025/`. No template changes needed.

## 9. Milestones

1. **M1 — Cleanup:** remove Search nav item; wire Register/CFP CTAs to config
   URLs; correct `website.md` Preact→Svelte note.
2. **M2 — Content pages:** build Speakers, Schedule, Sponsors, Venue against
   current schemas with empty-state handling.
3. **M3 — Polish:** responsive/a11y pass, meta per page, consistent Vanilla
   patterns across all pages.
4. **M4 — Content load:** replace placeholder YAML with real data as it lands.

## 10. Open questions

- Venue announcement date?
- Owner for speaker/schedule/sponsor content entry?
- 2025 look-back assets available?
