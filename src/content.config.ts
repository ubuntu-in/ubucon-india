import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Event details are config, not templates. Zod validates at build — a malformed
// or missing field fails the build instead of silently rendering wrong.

// Singleton: one keyed entry, read via getEntry('event', 'india-2026').
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
    ticketUrl: z.string().url(),
    cfpUrl: z.string().url().optional(),
    cfpDeadline: z.coerce.date().optional(),
  }),
});

// ponytail: image fields are string paths (public/) for now; swap to image() when
// assets are co-located and we want Astro's asset pipeline.
const speakers = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/speakers' }),
  schema: z.object({
    name: z.string(),
    title: z.string().optional(),
    org: z.string().optional(),
    bio: z.string(),
    photo: z.string().optional(),
    socials: z
      .object({ x: z.string().url(), mastodon: z.string().url(), github: z.string().url(), site: z.string().url() })
      .partial()
      .optional(),
    featured: z.boolean().default(false),
  }),
});

const schedule = defineCollection({
  loader: file('src/content/schedule.yaml'),
  schema: z.object({
    title: z.string(),
    speaker: reference('speakers').optional(),
    track: z.string().optional(),
    start: z.coerce.date(),
    end: z.coerce.date(),
    room: z.string().optional(),
  }),
});

const sponsors = defineCollection({
  loader: file('src/content/sponsors.yaml'),
  schema: z.object({
    name: z.string(),
    tier: z.enum(['platinum', 'gold', 'silver', 'community']),
    logo: z.string().optional(),
    url: z.string().url(),
  }),
});

// Previous-edition look-back (home page "Last year at…" block).
// Singleton keyed by edition, read via getEntry('lookback', 'india-2025').
// Image paths point to public/ — swap to image() if co-locating in src/assets.
const lookback = defineCollection({
  loader: file('src/content/lookback.yaml'),
  schema: z.object({
    edition: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    stats: z.array(z.object({ n: z.string(), label: z.string() })),
    gallery: z.array(z.object({ src: z.string(), alt: z.string() })),
    highlightsUrl: z.string().url().optional(),
  }),
});

export const collections = { event, speakers, schedule, sponsors, lookback };
