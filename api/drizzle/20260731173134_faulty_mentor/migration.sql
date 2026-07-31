CREATE TABLE `history` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`word` text NOT NULL,
	`result` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
