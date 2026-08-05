import { zValidator } from '@hono/zod-validator';
import type { Hono } from 'hono';
import { describeRoute, resolver, validator } from 'hono-openapi';
import type { HistoryRepository } from '../repositories/history.js';
import {
	historyCreateSchema,
	historyIdParamsSchema,
	historyListResponseSchema,
	historyPaginationQuerySchema,
	historyRecordSchema,
	historyUpdateSchema,
	historyWordCountListResponseSchema,
} from '../schemas/history.js';

export const registerHistoryRoutes = (
	app: Hono,
	history: HistoryRepository,
) => {
	app.get(
		'/history',
		validator('query', historyPaginationQuerySchema),
		describeRoute({
			description: 'List paginated search history records.',
			responses: {
				200: {
					description: 'A paginated list of search history records.',
					content: {
						'application/json': {
							schema: resolver(historyListResponseSchema),
						},
					},
				},
			},
		}),
		async (c) => {
			const { page, limit } = c.req.valid('query');

			try {
				const result = await history.list(page, limit);
				return c.json({
					data: result.data,
					pagination: {
						page,
						limit,
						total: result.total,
						totalPages: Math.ceil(result.total / limit),
					},
				});
			} catch (error) {
				return c.json({ error: error }, 500);
			}
		},
	);

	app.get(
		'/history/words',
		validator('query', historyPaginationQuerySchema),
		describeRoute({
			description: 'List unique searched words with their history counts.',
			responses: {
				200: {
					description: 'A paginated list of unique words and counts.',
					content: {
						'application/json': {
							schema: resolver(historyWordCountListResponseSchema),
						},
					},
				},
			},
		}),
		async (c) => {
			const { page, limit } = c.req.valid('query');

			try {
				const result = await history.listWordCounts(page, limit);
				return c.json({
					data: result.data,
					pagination: {
						page,
						limit,
						total: result.total,
						totalPages: Math.ceil(result.total / limit),
					},
				});
			} catch (error) {
				return c.json({ error: error }, 500);
			}
		},
	);

	app.delete(
		'/history/purge',
		describeRoute({
			description: 'Delete all search history records.',
			responses: {
				204: { description: 'All history records were deleted.' },
			},
		}),
		async (c) => {
			try {
				await history.purge();
				return c.body(null, 204);
			} catch (error) {
				return c.json({ error: error }, 500);
			}
		},
	);

	app.get(
		'/history/:id',
		zValidator('param', historyIdParamsSchema),
		describeRoute({
			description: 'Get one search history record by ID.',
			responses: {
				200: {
					description: 'The requested history record.',
					content: {
						'application/json': {
							schema: resolver(historyRecordSchema),
						},
					},
				},
				404: { description: 'History record not found.' },
			},
		}),
		async (c) => {
			const { id } = c.req.valid('param');

			try {
				const record = await history.findById(id);
				if (!record) {
					return c.json({ error: 'History record not found' }, 404);
				}
				return c.json(record);
			} catch (error) {
				return c.json({ error: error }, 500);
			}
		},
	);

	app.post(
		'/history',
		zValidator('json', historyCreateSchema),
		describeRoute({
			description: 'Create a search history record.',
			responses: {
				201: {
					description: 'The created history record.',
					content: {
						'application/json': {
							schema: resolver(historyRecordSchema),
						},
					},
				},
			},
		}),
		async (c) => {
			const data = c.req.valid('json');

			try {
				const record = await history.create(data);
				return c.json(record, 201);
			} catch (error) {
				return c.json({ error: error }, 500);
			}
		},
	);

	app.put(
		'/history/:id',
		zValidator('param', historyIdParamsSchema),
		validator('json', historyUpdateSchema),
		describeRoute({
			description: 'Update a search history record.',
			responses: {
				200: {
					description: 'The updated history record.',
					content: {
						'application/json': {
							schema: resolver(historyRecordSchema),
						},
					},
				},
				404: { description: 'History record not found.' },
			},
		}),
		async (c) => {
			const { id } = c.req.valid('param');
			const data = c.req.valid('json');

			try {
				const record = await history.update(id, data);
				if (!record) {
					return c.json({ error: 'History record not found' }, 404);
				}
				return c.json(record);
			} catch (error) {
				return c.json({ error: error }, 500);
			}
		},
	);

	app.delete(
		'/history/:id',
		zValidator('param', historyIdParamsSchema),
		describeRoute({
			description: 'Delete a search history record.',
			responses: {
				204: { description: 'History record deleted.' },
				404: { description: 'History record not found.' },
			},
		}),
		async (c) => {
			const { id } = c.req.valid('param');

			try {
				const record = await history.delete(id);
				if (!record) {
					return c.json({ error: 'History record not found' }, 404);
				}
				return c.body(null, 204);
			} catch (error) {
				return c.json({ error: error }, 500);
			}
		},
	);
};
