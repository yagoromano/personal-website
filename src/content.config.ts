import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    tags: z.array(z.string()),
    cover: z.string(),
    order: z.number(),

    /** Featured projects render a full card with cover, badge and outcome. The rest render compact. */
    featured: z.boolean().optional(),
    /** Short credential shown over the cover, e.g. "IEEE ICMLA 2025". */
    badge: z.string().optional(),
    badgeTone: z.enum(["paper", "current"]).optional(),
    /** One line of concrete, verifiable result. Scale, hardware, measured effect. */
    outcome: z.string().optional(),
    /** Eyebrow label on compact cards. */
    meta: z.string().optional(),

    paper: z
      .object({
        title: z.string(),
        venue: z.string(),
        authors: z.string(),
        url: z.string().url().optional(),
      })
      .optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = { projects, notes };
