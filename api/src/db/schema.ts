import { sql } from 'drizzle-orm';
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const historyTable = sqliteTable('history', {
	id: int('id').primaryKey({ autoIncrement: true }),
	word: text('word').notNull(),
	result: text('result'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
});
