CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`email_verified` integer DEFAULT false,
	`profile_picture_url` text,
	`organization_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `index_users_on_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `index_users_on_first_name` ON `users` (`first_name`);--> statement-breakpoint
CREATE INDEX `index_users_on_last_name` ON `users` (`last_name`);--> statement-breakpoint
CREATE INDEX `index_users_on_email_verified` ON `users` (`email_verified`);--> statement-breakpoint
CREATE INDEX `index_users_on_organization_id` ON `users` (`organization_id`);--> statement-breakpoint
ALTER TABLE `todos` ADD `user_id` text NOT NULL;