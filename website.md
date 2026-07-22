# UbuCon India 2026 Website — Project Plan

## Goals
- Sleek, minimal, not text-heavy, easy to navigate.
- Popular stack — easy to onboard contributors.
- Event details (schedule, speakers, sponsors, etc.) driven by config files, not hardcoded in templates.
- Strict Vanilla Framework (Canonical design system) integration.
- Light reactivity where needed (e.g. ticket CTA), not a full SPA.
- Deploy on GitHub Pages.

## Stack
- **Astro** — static site generator, ships zero JS by default, output is plain HTML/CSS. Popular, large ecosystem, low barrier for contributors.
- **Astro Content Collections (YAML)** — schema-validated data files under `src/content/` for events, speakers, schedule, sponsors. Editing event details = editing a YAML file, not touching templates.
- **Vanilla Framework (Sass)** — installed via npm, `@use` in global stylesheet. No custom design system, strict adherence to Canonical's framework.
- **Preact islands** — for interactive bits only (KonfHub ticket embed trigger, filters/search if needed). `client:load` / `client:visible` directives, rest of the page stays static.
- **GitHub Actions → GitHub Pages** — build on push, deploy static output. No backend/server.

## Ticketing
- Partnered with **KonfHub**.
- Static hosting = no backend, so ticketing is a **third-party embedded checkout only** (KonfHub widget/button script), not a custom integration.

## Design source
- Figma file `UbuCon-India-2026` (yOzS2sqKW2lt83MelXSpiy) — desktop Home on Page 3, mobile Home (360px) + reusable mobile nav component built separately, pending move to a dedicated page and split of About/Mission into its own page.

## Status
- Astro project scaffolded in `website/` (minimal template, TypeScript strict, no git init yet).
- Preact/Sass/Vanilla Framework integration not yet installed — paused before `astro add preact`.

## Open items
- Install Preact, Sass, Vanilla Framework.
- Define Content Collections schema (events, speakers, schedule, sponsors).
- Build shared layout (nav/footer) matching Figma design (desktop + mobile).
- Wire KonfHub embed.
- Set up GitHub Actions workflow for Pages deploy.
