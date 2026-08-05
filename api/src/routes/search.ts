import { zValidator } from '@hono/zod-validator';
import type { Hono } from 'hono';
import { describeRoute, resolver } from 'hono-openapi';
import {
	searchErrorSchema,
	searchParamsSchema,
	searchResultSchema,
} from '../schemas/search.js';
import type { WordSearchService } from '../services/word-search.js';

export const registerSearchRoutes = (
	app: Hono,
	wordSearch: WordSearchService,
) => {
	app.get(
		'/search/:word',
		zValidator('param', searchParamsSchema),
		describeRoute({
			description: 'Find the correct Dutch article for a word.',
			responses: {
				200: {
					description: 'The article result for the word.',
					content: {
						'text/plain': {
							schema: resolver(searchResultSchema),
						},
					},
				},
				500: {
					description: 'The search failed.',
					content: {
						'application/json': {
							schema: resolver(searchErrorSchema),
						},
					},
				},
			},
		}),
		async (c) => {
			const { word } = c.req.valid('param');

			try {
				const result = await wordSearch.find(word);
				c.header('x-cache', result.cache);
				return c.text(result.result);
			} catch (error) {
				console.error(`Failed to search for word: ${word}`, error);
				return c.json(
					{
						error: error instanceof Error ? error.message : 'Search failed',
					},
					500,
				);
			}
		},
	);
};
