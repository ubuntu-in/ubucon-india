# Contributing content

This guide is for **adding and updating event content**: a new edition,
speakers, sponsors, highlights, look-back stats, photos. You never edit
templates. All copy lives as YAML under `src/content/`, and every field is
validated at build time, so a missing or malformed value fails `bun run build`
with a clear error.

> Changing the site itself (pages, styling, components)? That's
> [HACKING.md](HACKING.md), not this file.

## Where content lives

| File | Controls |
|---|---|
| `src/content/event.yaml` | Every edition: names, dates, venue, CTAs, highlights, look-back stats and gallery. One top-level key per edition. |
| `src/content/speakers/*.yaml` | Featured speaker profiles. One file per speaker. |
| `src/content/sponsors.yaml` | Sponsor logos, tiers, links. One list, filtered by `edition`. |
| `src/content/site.yaml` | Site-wide contact channels, socials, contact form. |
| `public/img/` | All images, referenced from YAML by path (e.g. `/img/2025/talk.jpg`). |

`event.yaml` is the single source of truth for each edition. Add a key there and
the site automatically lists it on `/events`, builds its landing page, and (for
the latest past edition) shows its look-back on the home page.

---

## Add a new edition

Add a top-level key to `event.yaml`. The key is the slug — format `india-YYYY`.

```yaml
india-2027:
  name: UbuCon India 2027
  edition: "2027"
  startDate: 2027-11-12
  endDate: 2027-11-13
  venue: To be announced
  city: Mumbai, India
  eyebrow: The Ubuntu India Community Conference of 2027
  tagline: Your tagline here.
  intro: |
    One or two sentences about the event.
  ticketUrl: https://konfhub.com/ubucon-india-2027    # omit for past editions
  cfpUrl: https://events.canonical.com/event/NNN/abstracts/
  cfpDeadline: 2027-09-30
  indicoId: 999    # optional: pulls speakers + schedule from Indico
```

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Full event name. |
| `edition` | yes | Year string, e.g. `"2027"`. |
| `startDate` / `endDate` | yes | `YYYY-MM-DD` only. |
| `venue` | yes | Venue name or `"To be announced"`. |
| `city` | yes | `"City, India"`. |
| `eyebrow` | yes | Short tagline above headings. |
| `tagline` | yes | One-line motto. |
| `intro` | yes | 1–2 sentences. Use `|` for multi-line. |
| `indicoId` | no | Indico event id (the number in the CFP URL). Enables speakers + schedule. |
| `ticketUrl` | no | KonfHub or equivalent. Omit for past editions. |
| `cfpUrl` / `cfpDeadline` | no | Call-for-proposals link + deadline. Remove once CFP closes. |
| `highlights` | no | Highlight cards (see below). |
| `stats` / `gallery` / `highlightsUrl` | no | Look-back panel data (past editions, see below). |

- **Upcoming edition:** provide `ticketUrl`; include `cfpUrl` + `cfpDeadline`
  while the CFP is open, remove them once it closes.
- **Past edition:** omit `ticketUrl`, `cfpUrl`, `cfpDeadline`. Add `highlights`,
  `stats`, `gallery`, `highlightsUrl` instead.
- `/events` sorts by `startDate` descending automatically — key order doesn't matter.

---

## Add conference highlights

The home page "Conference Highlights" cards and each edition's Overview page read
the `highlights` array.

```yaml
highlights:
  - label: Inspiring talks
    image: /img/2026/talk.jpg
  - label: Keynote — The Future of Open Source
    image: /img/2026/keynote.jpg
    url: https://www.youtube.com/watch?v=XXXXXXXXXXX   # optional: card links out, gets a play badge
```

| Field | Required | Notes |
|---|---|---|
| `label` | yes | Card text. |
| `image` | no | Path under `public/`. Omit → grey placeholder. |
| `url` | no | Card becomes clickable, opens in new tab with a ▶ badge. |

3–4 cards (desktop grid is 3 wide). If the upcoming edition has no highlights,
the home page falls back to the latest past edition's — so keep past editions
populated. Images: `public/img/YYYY/`, ~600×400, JPEG/WebP.

---

## Add the look-back panel (past editions)

The home page shows a "Last year at…" panel using the latest past edition's data.
Add `stats` (exactly 3) and `gallery` (5 images):

```yaml
stats:
  - { n: "~300", label: Attendees }
  - { n: "35+",  label: Speakers }
  - { n: "38",   label: Sessions }
gallery:
  - { src: /img/2025/group.jpg,   alt: Group photo of attendees }
  - { src: /img/2025/keynote.jpg, alt: Keynote hall }
  # ...5 total
highlightsUrl: https://photos.app.goo.gl/example
```

- **Exactly 3 stats** (3-column grid). `n` is a string so `"~300"`, `"1200+"` work.
- **5 gallery images**: desktop is a 2×2 grid + 5th spanning full width; mobile
  shows the first only. Fewer works but leaves gaps.
- The panel appears only if the latest past edition has at least one stat or image.

---

## Speakers & schedule (Indico)

The **full** line-up and the schedule both come from Indico — you don't type them
by hand. Set `indicoId` on the edition (the number in the CFP URL, e.g.
`events.canonical.com/event/157` → `indicoId: 157`).

- **Speakers:** run `python3 scripts/fetch_speakers.py` to pull the line-up into
  `src/content/lineup.yaml`, then **commit that file**. Regenerate whenever the
  Indico programme changes. The site reads the static YAML — no build-time network.
- **Schedule:** fetched live at build from `…/export/event/{id}.json`. No token
  needed for published events; if the fetch fails, the page shows "published later"
  and the build still passes. Times are exported in UTC, shown in IST (`Asia/Kolkata`).

### Featured speakers

`src/content/speakers/*.yaml` is **only** for the handful of speakers you want to
spotlight with a photo and bio. They render first (with a "Featured" badge) and
feed the Overview "Featured speakers" strip. Everyone else comes from Indico.
A featured entry whose `name` matches an Indico speaker replaces the plain card
(case-insensitive).

One file per speaker, `src/content/speakers/firstname-lastname.yaml`:

```yaml
edition: india-2026
name: Jane Doe
title: Senior Developer Advocate
org: Canonical
bio: >-
  Two to four sentences. Use "To be announced" if you don't have it yet.
photo: /img/speakers/jane-doe.jpg   # optional → placeholder avatar
featured: true
socials:
  github: https://github.com/janedoe   # any of: x, mastodon, github, site (full URLs)
```

| Field | Required | Notes |
|---|---|---|
| `edition` | yes | Event slug, e.g. `india-2026`. |
| `name` | yes | Full name. |
| `bio` | yes | 2–4 sentences. Use `>-` for multi-line. No Lorem ipsum. |
| `title` / `org` | no | Job title / organisation. |
| `photo` | no | Path under `public/`. Omit → placeholder avatar. |
| `socials` | no | Any of `x`, `mastodon`, `github`, `site` — full URLs. |
| `category` | no | Filter-chip group on the Speakers page (e.g. `Keynote`, `Community`). |
| `featured` | no | `true` puts them first + in the Overview preview. Defaults `false`. |

Photos: `public/img/speakers/`, ~400×400, JPEG/WebP, <200 KB. A speaker at
multiple editions needs a separate file per edition.

---

## Add sponsors

Append to `src/content/sponsors.yaml`:

```yaml
- edition: india-2026
  name: Canonical
  tier: platinum          # diamond | platinum | gold | silver | bronze | supporter | community
  logo: /img/sponsors/canonical.svg   # optional (community tier can be text-only)
  url: https://canonical.com
```

| Field | Required | Notes |
|---|---|---|
| `edition` | yes | Event slug. |
| `name` | yes | As displayed. |
| `tier` | yes | One of `diamond`, `platinum`, `gold`, `silver`, `bronze`, `supporter`, `community`. Controls grouping. |
| `logo` | no | Path under `public/`. SVG preferred, PNG ok. Community tier can be text-only. |
| `url` | yes | Must start with `https://`. |

A sponsor across multiple editions needs a separate entry per edition.

---

## Venue page (optional, per-edition)

Enrich an edition with a map, address, and "Getting there" accordion. All
optional — omit and the page shows the basic `To be announced` state.

```yaml
india-2026:
  venue: Bengaluru Convention Centre
  venueAddress: 123 Community Road, Bengaluru, Karnataka 560001, India
  mapEmbed: https://www.google.com/maps/embed?pb=…   # Maps → Share → Embed a map → copy src="…" only
  gettingThere:
    - { title: By Metro, body: Nearest metro is a 5-minute walk. }
    - { title: By Air,   body: Airport is ~40 km away. }
```

`gettingThere` renders as an accordion (first item open). Omit → no accordion.
Unset `mapEmbed` → grey placeholder.

## Sponsors page prospectus (optional)

```yaml
india-2026:
  prospectusUrl: https://…/ubucon-india-2026-prospectus.pdf
```

Adds a "Download prospectus" button to the Sponsors CTA. Omitted → only
"Become a sponsor" shows.

## Site config — `src/content/site.yaml`

Site-wide (not per-edition): the Contact page's channels, socials, and form.

```yaml
site:
  formAccessKey: ""          # Web3Forms key (https://web3forms.com, free). Empty ⇒ form disabled.
  contacts:
    - { label: General enquiries, email: hello@ubuconindia.org }
    - { label: Sponsorship, email: sponsors@ubuconindia.org }
  socials: { mastodon: https://…, x: https://…, linkedin: https://…, github: https://… }
```

The form POSTs to Web3Forms (works on GitHub Pages, no backend). Until
`formAccessKey` is set, the submit button is disabled with a note to email directly.

---

## Images

- Put files under `public/img/`; reference from YAML with a leading slash:
  `/img/speakers/jane.jpg` → `public/img/speakers/jane.jpg`.
- Speaker photos: `public/img/speakers/`, ~400×400, <200 KB.
- Sponsor logos: `public/img/sponsors/`, SVG preferred.
- Gallery / highlight photos: `public/img/YYYY/`, JPEG/WebP.
- `src/assets/` images use Astro's `Image` component — don't reference those from YAML.
- Optimise before committing (WebP for photos, SVG for logos). Always give gallery
  images `alt` text.

---

## Before you push

```sh
bun run build
```

If a required field is missing or a date/URL is malformed, the build fails and
names the field.

| Error | Fix |
|---|---|
| `Required` on `name`/`edition`/etc. | Add the missing field. |
| `Invalid date` | Use `YYYY-MM-DD` only. |
| `Invalid url` | Prefix the URL with `https://`. |
| `edition` field missing | Add `edition: india-YYYY` to the speaker/sponsor entry. |
| `tier` invalid | Use a valid tier value (see Sponsors). |

---

## After the event

Convert the edition to a past edition in `event.yaml`:

1. Add `stats`, `gallery`, `highlightsUrl` so the look-back panel appears.
2. Add `highlights` cards with images (they become the fallback for the next edition).
3. Remove `ticketUrl`, `cfpUrl`, `cfpDeadline`.

The home page automatically switches to this edition's look-back and uses its
highlights as the fallback for the next event.
