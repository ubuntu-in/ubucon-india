# Hacking on the site

This is for **changing the website itself**: pages, components, styling, routing,
build and deploy. If you only want to add an edition, speaker or sponsor, you
don't need any of this - see [CONTRIBUTIONS.md](CONTRIBUTIONS.md).

## Stack

| Piece | Choice | Why |
|---|---|---|
| Framework | [Astro](https://astro.build) 7 | Static output, zero JS by default, content collections. |
| Design system | [Vanilla Framework](https://vanillaframework.io) 4 (SCSS) | Canonical's system; keeps us on-brand with Ubuntu. |
| Interactivity | [Svelte](https://svelte.dev) 5 islands | Only where the DOM genuinely needs JS. |
| Package manager | bun | Lockfile is `bun.lock`. |
| Host | GitHub Pages | Project page at `ubucon.org/india`. |

Node >= 22.12. Config: `astro.config.mjs` (note `base: '/india'`),
`svelte.config.js`, `tsconfig.json`.

## Run it

```sh
bun install
bun run dev       # dev server with HMR
bun run build     # static build to ./dist  (also the CI gate)
bun run preview   # serve ./dist locally
```

`bun run build` is what CI runs and what catches content-schema errors, so run
it before pushing.

## Layout

```
src/
  pages/            File-based routes.
    index.astro     Home page.
    about.astro, contact.astro
    events/
      index.astro         /events listing (all editions).
      [slug]/             Per-edition pages (dynamic route keyed by edition slug).
        index.astro       Edition landing / Overview.
        speakers.astro  schedule.astro  sponsors.astro  venue.astro
  layouts/Base.astro      Wraps every page (head, Nav, Footer, global styles).
  components/             Nav, Footer, Icon, Breadcrumbs, Pagination (Astro);
                          SpeakerGrid (Svelte island).
  content/                YAML data + content.config.ts (Zod schemas).
  lib/                    url.ts, dates.ts, indico.ts.
  styles/global.scss      Brand tokens (CSS vars) + Vanilla imports + a few overrides.
  assets/                 Images processed by Astro's <Image> (hero, about art).
public/                   Served as-is (favicons, /img/**).
```

## Conventions that matter

### Base-path links: always use `url()`

The site lives under `/india`, and Astro does **not** auto-prefix `href`s or
asset paths. Route every internal link and every `public/` asset through
`url()` (`src/lib/url.ts`):

```astro
<a href={url('/about')}>About</a>
<img src={url(s.logo)} />
```

`src/assets/` images are different: import them and use Astro's `<Image>`, which
handles the base path and optimisation itself.

### Content is data, not markup

Copy lives in `src/content/*.yaml`, typed by `src/content.config.ts` (Zod). Read
it in a page with `getCollection('event')` and friends. Never hardcode event
copy in a template - add a field to the schema and the YAML instead. Adding a
schema field is a code change and belongs here; filling it in is
[CONTRIBUTIONS.md](CONTRIBUTIONS.md).

### Reach for Svelte only when you must

Pages are static HTML. Add a Svelte island (with a `client:*` directive) only
when the DOM needs to react at runtime - `SpeakerGrid.svelte` (chip filtering) is
the one current example. Prefer CSS (see `Nav.astro`'s pure-CSS mobile menu)
before adding JS.

### Speakers and schedule come from Indico

Two different mechanisms, both keyed by `indicoId` in `event.yaml`:

- **Speakers** are generated ahead of time. Run `python3
  scripts/fetch_speakers.py` (stdlib only) to pull the line-up from
  `events.canonical.com` into `src/content/lineup.yaml`, then commit it. The
  site reads that static file - no network at build time. Regenerate whenever
  the Indico programme changes.
- **Schedule** is still fetched live at build time by `src/lib/indico.ts`. On a
  fetch failure it caches nothing and the schedule page falls back to its
  "published later" state, so a flaky network never breaks a deploy.

## Styling

- Brand tokens are CSS custom properties in `src/styles/global.scss`
  (`--u-aubergine`, `--u-orange`, `--u-pink`, `--u-placeholder`, `--u-maxw`).
  Use these, not raw hex.
- Prefer real Vanilla components (`p-button`, `p-chip`, `p-accordion`,
  `p-strip`, ...) over hand-rolled markup. Vanilla is a design system, not a JS
  library - there's no runtime to import.
- Brand deviations from stock Vanilla: **green** positive buttons (not orange),
  **square** corners (little to no border-radius), aubergine headings.
- Page-specific CSS goes in a scoped `<style>` block in that `.astro` file.
  Only truly global rules go in `global.scss`.

## Adding a page

Drop a `.astro` file in `src/pages/` (the path is the route). Wrap it in the
base layout and pass metadata:

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Sponsors" description="Back the conference.">
  <section class="p-strip"> ... </section>
</Base>
```

Per-edition pages live under `src/pages/events/[slug]/` and use
`getStaticPaths()` to emit one page per edition. Nav is context-aware: it shows
the edition sub-nav on those routes and the global nav elsewhere - see
`Nav.astro`.

## Deploy

`main` -> `.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
One-time: **Settings -> Pages -> Source = GitHub Actions**. The `ubucon.org`
domain is owned by a separate org Pages repo, so don't add a CNAME here. Changing
`base`/`site` in `astro.config.mjs` moves every URL - do it deliberately.

## Gotchas

- **Vanilla 4 uses `@import`.** Sass deprecation warnings from the framework are
  silenced in `astro.config.mjs` (`silenceDeprecations`). Don't "fix" Vanilla's
  internals; the noise is theirs, not ours.
- **Forgot `url()`?** Links work in `dev` (served at root) but 404 on the
  deployed `/india` site. Always wrap internal links.
- **`_example.yaml`** under `speakers/` targets a non-existent edition on
  purpose, so it renders nowhere but keeps the collection non-empty. Leave it.
