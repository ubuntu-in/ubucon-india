import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

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
    cover: z.string().optional(),
    indicoId: z.number().int().positive().optional(),
    highlights: z
      .array(z.object({ label: z.string(), image: z.string().optional(), url: z.url().optional() }))
      .default([]),
    ticketUrl: z.url().optional(),
    prospectusUrl: z.url().optional(),
    cfpUrl: z.url().optional(),
    cfpDeadline: z.coerce.date().optional(),
    highlightsUrl: z.url().optional(), // recap/album link
    stats: z.array(z.object({ n: z.string(), label: z.string() })).default([]),
    gallery: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    venueAddress: z.string().optional(),
    mapEmbed: z.url().optional(),
    gettingThere: z
      .array(z.object({ title: z.string(), body: z.string() }))
      .default([]),
  }),
});

const speakers = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/speakers' }),
  schema: z.object({
    edition: z.string(),
    name: z.string(),
    title: z.string().optional(),
    org: z.string().optional(),
    talk: z.string().optional(),
    bio: z.string(),
    photo: z.string().optional(),
    socials: z
      .object({ x: z.url(), mastodon: z.url(), github: z.url(), site: z.url() })
      .partial()
      .optional(),
    featured: z.boolean().default(false),
    category: z.string().optional(),
  }),
});

const site = defineCollection({
  loader: file('src/content/site.yaml'),
  schema: z.object({
    formgridId: z.string().default(''),
    contacts: z
      .array(z.object({ label: z.string(), email: z.string().email() }))
      .default([]),
    socials: z
      .object({ x: z.url(), mastodon: z.url(), linkedin: z.url(), github: z.url() })
      .partial()
      .optional(),
  }),
});

const lineup = defineCollection({
  loader: file('src/content/lineup.yaml'),
  schema: z.object({
    edition: z.array(z.string()).nonempty(),
    name: z.string(),
    affiliation: z.string().optional(),
    track: z.string().optional(),
    featured: z.boolean().default(false),
    photo: z.string().optional(),
  }),
});

const sponsors = defineCollection({
  loader: file('src/content/sponsors.yaml'),
  schema: z.object({
    editions: z.array(z.string()).nonempty(),
    name: z.string(),
    tier: z.enum(['diamond', 'gold', 'silver', 'bronze', 'supporter', 'community']),
    logo: z.string().optional(),
    url: z.url(),
  }),
});

export const collections = { event, speakers, lineup, sponsors, site };
