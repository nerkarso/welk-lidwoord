import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { historyTable } from '../db/schema.js';

export type HistoryRecord = typeof historyTable.$inferSelect;

export interface HistoryPage {
	data: HistoryRecord[];
	total: number;
}

export type HistoryWordCount = {
	word: string;
	count: number;
};

export interface HistoryWordCountPage {
	data: HistoryWordCount[];
	total: number;
}

export class HistoryRepository {
	async list(page: number, limit: number): Promise<HistoryPage> {
		const offset = (page - 1) * limit;
		const [data, count] = await Promise.all([
			db
				.select()
				.from(historyTable)
				.orderBy(desc(historyTable.createdAt))
				.limit(limit)
				.offset(offset)
				.all(),
			db.select({ total: sql<number>`count(*)` }).from(historyTable).get(),
		]);

		return {
			data,
			total: count?.total ?? 0,
		};
	}

	async listWordCounts(
		page: number,
		limit: number,
	): Promise<HistoryWordCountPage> {
		const offset = (page - 1) * limit;
		const countExpression = sql<number>`count(*)`;
		const [data, count] = await Promise.all([
			db
				.select({
					word: historyTable.word,
					count: countExpression,
				})
				.from(historyTable)
				.groupBy(historyTable.word)
				.orderBy(desc(countExpression), historyTable.word)
				.limit(limit)
				.offset(offset)
				.all(),
			db
				.select({ total: sql<number>`count(distinct ${historyTable.word})` })
				.from(historyTable)
				.get(),
		]);

		return {
			data,
			total: count?.total ?? 0,
		};
	}

	async findById(id: number) {
		return db.select().from(historyTable).where(eq(historyTable.id, id)).get();
	}

	async findByWord(word: string) {
		return db
			.select()
			.from(historyTable)
			.where(eq(historyTable.word, word))
			.get();
	}

	async create(data: { word: string; result?: string | null }) {
		return db
			.insert(historyTable)
			.values({
				word: data.word,
				result: data.result ?? null,
			})
			.returning()
			.get();
	}

	async createIfAbsent(data: { word: string; result: string }) {
		const record = await db
			.insert(historyTable)
			.values(data)
			.onConflictDoNothing({ target: historyTable.word })
			.returning()
			.get();

		return record ?? (await this.findByWord(data.word));
	}

	async update(id: number, data: { word?: string; result?: string | null }) {
		return db
			.update(historyTable)
			.set(data)
			.where(eq(historyTable.id, id))
			.returning()
			.get();
	}

	async delete(id: number) {
		return db
			.delete(historyTable)
			.where(eq(historyTable.id, id))
			.returning()
			.get();
	}

	async purge() {
		const result = await db.delete(historyTable).run();
		return result.changes;
	}
}
