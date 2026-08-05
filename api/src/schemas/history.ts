import { z } from 'zod';

export const historyRecordSchema = z.object({
	id: z.number(),
	word: z.string(),
	result: z.string().nullable(),
	createdAt: z.date(),
});

export const historyListSchema = z.array(historyRecordSchema);

export const historyPaginationQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const historyPaginationSchema = z.object({
	page: z.number().int().min(1),
	limit: z.number().int().min(1),
	total: z.number().int().min(0),
	totalPages: z.number().int().min(0),
});

export const historyListResponseSchema = z.object({
	data: historyListSchema,
	pagination: historyPaginationSchema,
});

export const historyWordCountSchema = z.object({
	word: z.string(),
	count: z.number().int().min(0),
});

export const historyWordCountListResponseSchema = z.object({
	data: z.array(historyWordCountSchema),
	pagination: historyPaginationSchema,
});

export const historyIdParamsSchema = z.object({
	id: z.coerce.number().int().positive(),
});

export const historyCreateSchema = z.object({
	word: z.string().min(1),
	result: z.string().nullable().default(null),
});

export const historyUpdateSchema = z
	.object({
		word: z.string().min(1).optional(),
		result: z.string().nullable().optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: 'At least one field is required',
	});
