import { z } from 'zod';

export const searchParamsSchema = z.object({
	word: z.string().min(1),
});

export const searchResultSchema = z.string();

export const searchErrorSchema = z.object({
	error: z.string(),
});
