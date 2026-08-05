import { sql } from 'drizzle-orm';
import {
	index,
	int,
	integer,
	sqliteTable,
	text,
} from 'drizzle-orm/sqlite-core';

export const historyTable = sqliteTable(
	'history',
	{
		id: int('id').primaryKey({ autoIncrement: true }),
		word: text('word').notNull().unique(),
		result: text('result'),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(unixepoch())`),
	},
	(table) => [index('id_word_idx').on(table.id, table.word)],
);
