import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { guideCategoryOrder } from './lib/guides/catalog';

const guides = defineCollection({
	loader: glob({ base: './src/content/guides', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			seoTitle: z.string().optional(),
			seoDescription: z.string().optional(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			category: z.enum(guideCategoryOrder),
			tags: z.array(z.string()).default([]),
			primaryTool: z.string().optional(),
			faqs: z
				.array(
					z.object({
						question: z.string(),
						answer: z.string(),
					}),
				)
				.default([]),
		}),
});

export const collections = { guides };
