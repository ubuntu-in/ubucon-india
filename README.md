# UbuCon India

The official website for UbuCon India, the annual Ubuntu India Community
Conference. Static site, one codebase, one entry per edition.

Built with [Astro](https://astro.build) + [Vanilla
Framework](https://vanillaframework.io) (Canonical's design system), with a few
[Svelte](https://svelte.dev) islands for the interactive bits. Deploys to GitHub
Pages at `https://ubucon.org/india`.

## Quick start

Package manager is **bun**.

```sh
bun install
bun run dev       # local dev server
bun run build     # production build to ./dist
bun run preview   # preview the build
```

Node >= 22.12.

## What's where

```
src/
  content/    Event data as YAML (the stuff you edit most). Validated by Zod.
  pages/      Routes. index.astro is the home page; events/ holds per-edition pages.
  components/ Reusable Astro + Svelte components (Nav, Footer, SpeakerGrid, ...).
  layouts/    Base.astro wraps every page.
  lib/        Helpers: url() (base-path links), dates, Indico fetch.
  styles/     global.scss (brand tokens + Vanilla imports).
public/img/   Images, referenced from YAML by path (e.g. /img/2025/talk.jpg).
```

## Two ways to help

- **Adding or updating event content** (a new edition, speakers, sponsors,
  highlights, photos): you only touch YAML files. See **[CONTRIBUTIONS.md](CONTRIBUTIONS.md)**.
- **Changing the website itself** (pages, components, styling, build, deploy):
  see **[HACKING.md](HACKING.md)**.
