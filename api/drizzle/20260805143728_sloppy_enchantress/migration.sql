CREATE TABLE `history` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`word` text NOT NULL UNIQUE,
	`result` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `id_word_idx` ON `history` (`id`,`word`);