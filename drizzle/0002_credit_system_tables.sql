CREATE TABLE `credit_transactions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('purchase','deduction','refund','bonus','admin_grant') NOT NULL,
	`amount` int NOT NULL,
	`balanceAfter` int NOT NULL,
	`description` varchar(255),
	`stripeSessionId` varchar(128),
	`aiAction` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `credit_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `credit_package_purchases` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`packId` varchar(64) NOT NULL,
	`packName` varchar(128) NOT NULL,
	`credits` int NOT NULL,
	`amountCents` int NOT NULL,
	`stripeSessionId` varchar(128) NOT NULL,
	`stripeCustomerId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `credit_package_purchases_id` PRIMARY KEY(`id`)
);
