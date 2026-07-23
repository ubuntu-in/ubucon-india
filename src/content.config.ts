import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file } from 'astro/loaders';

const event = defineCollection({
  loader: file('src/content/event.yaml'),
  schema: ({ image }) => z.object({
    name: z.string(),
    edition: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    venue: z.string(),
    city: z.string(),
    eyebrow: z.string(),
    tagline: z.string(),
    intro: z.string(),
    cover: image().optional(),
    indicoId: z.number().int().positive().optional(),
    highlights: z
      .array(z.object({ label: z.string(), image: image().optional(), url: z.url().optional() }))
      .default([]),
    ticketUrl: z.url().optional(),
    prospectusUrl: z.url().optional(),
    cfpUrl: z.url().optional(),
    cfpDeadline: z.coerce.date().optional(),
    highlightsUrl: z.url().optional(), // recap/album link
    stats: z.array(z.object({ n: z.string(), label: z.string() })).default([]),
    gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
    venueAddress: z.string().optional(),
    mapEmbed: z.url().optional(),
    gettingThere: z
      .array(z.object({ title: z.string(), body: z.string() }))
      .default([]),
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
  schema: ({ image }) => z.object({
    edition: z.array(z.string()).nonempty(),
    name: z.string(),
    affiliation: z.string().optional(),
    track: z.string().optional(),
    featured: z.boolean().default(false),
    photo: image().optional(),
  }),
});

const sponsors = defineCollection({
  loader: file('src/content/sponsors.yaml'),
  schema: ({ image }) => z.object({
    editions: z.array(z.string()).nonempty(),
    name: z.string(),
    tier: z.enum(['diamond', 'gold', 'silver', 'bronze', 'supporter', 'community']),
    logo: image().optional(),
    url: z.url(),
  }),
});

const supporters = defineCollection({
  loader: file('src/content/supporters.yaml'),
  schema: ({ image }) => z.object({
    edition: z.array(z.string()).nonempty(),
    name: z.string(),
    organisation: z.string().optional(),
    designation: z.string().optional(),
    photo: image().optional(),
  }),
});

export const collections = { event, lineup, sponsors, site, supporters };
