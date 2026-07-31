import { eq } from 'drizzle-orm';
import { db } from './db/index.js';
import { historyTable } from './db/schema.js';

export const listHistory = async () => {
	const records = await db.select().from(historyTable).all();
	return records;
};

export const getHistory = async (word: string) => {
	const record = await db
		.select()
		.from(historyTable)
		.where(eq(historyTable.word, word))
		.get();
	return record;
};

export const addHistory = async (word: string, result: string) => {
	const record = await db
		.insert(historyTable)
		.values({
			word,
			result,
		})
		.returning()
		.get();
	return record;
};
