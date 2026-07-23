import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Event details are config, not templates. Zod validates at build - a malformed
// or missing field fails the build instead of silently rendering wrong.

// Multi-edition: top-level YAML keys are entry ids (india-2026, india-2025…).
// Read one via getEntry('event', 'india-2026'); list via getCollection('event').
const event = defineCollection({
  loader: file('src/content/event.yaml'),
  schema: z.object({
    name: z.string(),
    edition: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    venue: z.string(),
    city: z.string(),
    eyebrow: z.string(),
    tagline: z.string(),
    intro: z.string(),
    cover: z.string().optional(), // public/ path - /events card overlay + landing hero art
    indicoId: z.number().int().positive().optional(), // events.canonical.com event id - speakers + schedule are fetched from Indico
    // "Conference Highlights" cards. image is an optional public/ path; when
    // omitted the card falls back to the grey placeholder.
    highlights: z
      .array(z.object({ label: z.string(), image: z.string().optional(), url: z.string().url().optional() }))
      .default([]), // url → card links out (e.g. YouTube talk recording)
    ticketUrl: z.string().url().optional(), // past editions have no live ticketing
    prospectusUrl: z.string().url().optional(), // sponsor prospectus PDF (Sponsors page CTA)
    cfpUrl: z.string().url().optional(),
    cfpDeadline: z.coerce.date().optional(),
    // Look-back (shown on home for the latest past edition, and on the edition
    // landing). Single source of truth per edition - no separate collection.
    highlightsUrl: z.string().url().optional(), // recap/album link
    stats: z.array(z.object({ n: z.string(), label: z.string() })).default([]),
    gallery: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    // Venue page extras. All optional - when absent the venue page shows the
    // "to be announced" state. `venue` (above) is the venue name; these enrich it.
    venueAddress: z.string().optional(), // street line, e.g. "123 Community Road…"
    mapEmbed: z.string().url().optional(), // Google Maps embed src (iframe). Grey placeholder when unset.
    gettingThere: z
      .array(z.object({ title: z.string(), body: z.string() }))
      .default([]), // "Getting there" accordion (By Metro / By Air / …)
  }),
});

// ponytail: image fields are string paths (public/) for now; swap to image() when
// assets are co-located and we want Astro's asset pipeline.
const speakers = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/speakers' }),
  schema: z.object({
    edition: z.string(), // event slug, e.g. "india-2026"
    name: z.string(),
    title: z.string().optional(),
    org: z.string().optional(),
    talk: z.string().optional(), // talk title (populated from Indico later)
    bio: z.string(),
    photo: z.string().optional(),
    socials: z
      .object({ x: z.string().url(), mastodon: z.string().url(), github: z.string().url(), site: z.string().url() })
      .partial()
      .optional(),
    featured: z.boolean().default(false),
    // Filter category for the speakers page chips (e.g. "Keynote", "AI/ML",
    // "Community"). Optional - speakers pulled from the Indico API later may set
    // this; the "All" chip always shows everyone.
    category: z.string().optional(),
  }),
});

// Site-wide singleton config: things that aren't per-edition (contact channels,
// social links, contact-form endpoint). Single entry keyed `site` - read with
// getEntry('site', 'site').
const site = defineCollection({
  loader: file('src/content/site.yaml'),
  schema: z.object({
    // Web3Forms access key - the contact form POSTs to api.web3forms.com. Works
    // on static hosting (GitHub Pages), no backend. Placeholder until a real key
    // is issued at https://web3forms.com (free). Empty string disables submit.
    formAccessKey: z.string().default(''),
    contacts: z
      .array(z.object({ label: z.string(), email: z.string().email() }))
      .default([]),
    socials: z
      .object({ x: z.string().url(), mastodon: z.string().url(), linkedin: z.string().url(), github: z.string().url() })
      .partial()
      .optional(),
  }),
});

// Schedule is sourced from Indico at build (see src/lib/indico.ts) - no manual
// collection.

// Full speaker line-up, generated (append-merged) from Indico by
// scripts/fetch_speakers.py. Curated `speakers` (above) override matching
// entries by name on the page; `featured` here promotes a line-up entry too.
const lineup = defineCollection({
  loader: file('src/content/lineup.yaml'),
  schema: z.object({
    // editions this speaker appears in - a person can return across years.
    edition: z.array(z.string()).nonempty(),
    name: z.string(),
    affiliation: z.string().optional(),
    track: z.string().optional(),
    featured: z.boolean().default(false), // hand-set; survives regeneration
    photo: z.string().optional(), // hand-set public/ path; survives regeneration
  }),
});

const sponsors = defineCollection({
  loader: file('src/content/sponsors.yaml'),
  schema: z.object({
    // editions this sponsor appears in. ponytail: single tier across all of
    // them - if a partner's tier differs per edition, split into 2 entries.
    editions: z.array(z.string()).nonempty(),
    name: z.string(),
    tier: z.enum(['diamond', 'platinum', 'gold', 'silver', 'bronze', 'supporter', 'community']),
    logo: z.string().optional(),
    url: z.string().url(),
  }),
});

export const collections = { event, speakers, lineup, sponsors, site };
