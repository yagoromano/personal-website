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
    gridHidden: z.boolean().optional(),
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
