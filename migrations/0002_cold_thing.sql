ALTER TABLE `todos` ADD `priority` text DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE `todos` ADD `urgency` text DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE `todos` ADD `estimated_time` integer;--> statement-breakpoint
ALTER TABLE `todos` ADD `actual_time` integer;