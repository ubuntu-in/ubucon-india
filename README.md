# UbuCon India 2026

Static site for UbuCon India 2026. Astro + Vanilla Framework (Canonical),
Svelte islands for the few interactive bits. Deploys to GitHub Pages at
`https://ubucon.org/india`.

## Develop

Package manager is **bun**.

```sh
bun install
bun run dev       # local dev server
bun run build     # production build to ./dist
bun run preview   # preview the build
```

## Editing event content

Event details are config, not templates — edit YAML under `src/content/`:

- `event.yaml` — name, dates, venue, tagline, ticket URL (single source of truth).
- `speakers/<slug>.yaml` — one file per speaker.
- `schedule.yaml` — sessions (each `speaker:` references a speakers entry id).
- `sponsors.yaml` — sponsors by tier.

Schemas live in `src/content.config.ts`; a bad or missing field fails the build.

Internal links/assets must go through `url()` in `src/lib/url.ts` so they carry
the `/india` base path.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml` (build + deploy to Pages).
One-time: repo **Settings → Pages → Source = GitHub Actions**. No CNAME here —
the `ubucon.org` custom domain lives in the org's separate Pages repo.
