import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { guideCategoryOrder } from './lib/guides/catalog';

const guides = defineCollection({
	loader: glob({ base: './src/content/guides', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			image: z.string().optional(),
			author_name: z.string().optional(),
			author_image: z.string().optional(),
			category: z.enum(guideCategoryOrder),
			tags: z.array(z.string()).default([]),
			primaryTool: z.string().optional(),
		}),
});

export const collections = { guides };
