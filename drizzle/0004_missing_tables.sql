-- Migration 0004: Create all tables that exist in schema.ts but are missing from PlanetScale
-- These tables were added after the initial migration and need to be created.

-- broadcast_messages (used by adminRouter.sendBroadcast)
CREATE TABLE IF NOT EXISTS `broadcast_messages` (
  `id` serial NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `type` varchar(64) NOT NULL DEFAULT 'info',
  `targetRole` varchar(64),
  `sentAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sentBy` int,
  CONSTRAINT `broadcast_messages_id` PRIMARY KEY(`id`)
);

-- athlete_feedback (used by feedbackRouter)
CREATE TABLE IF NOT EXISTS `athlete_feedback` (
  `id` serial NOT NULL,
  `userId` int NOT NULL,
  `category` varchar(64) NOT NULL DEFAULT 'general',
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(64) NOT NULL DEFAULT 'open',
  `upvotes` int NOT NULL DEFAULT 0,
  `adminNote` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `athlete_feedback_id` PRIMARY KEY(`id`)
);

-- feedback_votes (used by feedbackRouter)
CREATE TABLE IF NOT EXISTS `feedback_votes` (
  `id` serial NOT NULL,
  `feedbackId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `feedback_votes_id` PRIMARY KEY(`id`),
  UNIQUE KEY `feedback_votes_feedbackId_userId_unique` (`feedbackId`, `userId`)
);

-- subscription_expiry_notices (used by stripeRouter/webhook)
CREATE TABLE IF NOT EXISTS `subscription_expiry_notices` (
  `id` serial NOT NULL,
  `userId` int NOT NULL,
  `subscriptionId` varchar(255),
  `noticeType` varchar(64) NOT NULL DEFAULT 'expiry',
  `status` varchar(64) NOT NULL DEFAULT 'sent',
  `sentAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `subscription_expiry_notices_id` PRIMARY KEY(`id`)
);

-- athlete_data_sources (used by dataRouter)
CREATE TABLE IF NOT EXISTS `athlete_data_sources` (
  `id` serial NOT NULL,
  `userId` int NOT NULL,
  `sourceType` varchar(64) NOT NULL,
  `sourceUrl` text,
  `sourceName` varchar(255),
  `isActive` boolean NOT NULL DEFAULT true,
  `lastFetchedAt` timestamp,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `athlete_data_sources_id` PRIMARY KEY(`id`)
);

-- athlete_data_events (used by dataRouter)
CREATE TABLE IF NOT EXISTS `athlete_data_events` (
  `id` serial NOT NULL,
  `userId` int NOT NULL,
  `sourceId` int,
  `eventType` varchar(64) NOT NULL,
  `title` varchar(255),
  `description` text,
  `eventDate` timestamp,
  `metadata` json,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `athlete_data_events_id` PRIMARY KEY(`id`)
);

-- athlete_data_summaries (used by dataRouter)
CREATE TABLE IF NOT EXISTS `athlete_data_summaries` (
  `id` serial NOT NULL,
  `userId` int NOT NULL,
  `summaryType` varchar(64) NOT NULL DEFAULT 'weekly',
  `content` text NOT NULL,
  `periodStart` timestamp,
  `periodEnd` timestamp,
  `generatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `athlete_data_summaries_id` PRIMARY KEY(`id`)
);

-- subscriptions (referenced in db.ts raw SQL)
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` serial NOT NULL,
  `userId` int NOT NULL,
  `stripeSubscriptionId` varchar(255) NOT NULL,
  `stripeCustomerId` varchar(255) NOT NULL,
  `tierId` varchar(64) NOT NULL,
  `status` varchar(64) NOT NULL DEFAULT 'active',
  `currentPeriodStart` timestamp,
  `currentPeriodEnd` timestamp,
  `cancelAtPeriodEnd` boolean NOT NULL DEFAULT false,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
  UNIQUE KEY `subscriptions_stripeSubscriptionId_unique` (`stripeSubscriptionId`)
);

-- payments (referenced in db.ts raw SQL)
CREATE TABLE IF NOT EXISTS `payments` (
  `id` serial NOT NULL,
  `userId` int NOT NULL,
  `stripePaymentIntentId` varchar(255),
  `stripeInvoiceId` varchar(255),
  `amount` varchar(32) NOT NULL,
  `currency` varchar(8) NOT NULL DEFAULT 'usd',
  `status` varchar(64) NOT NULL DEFAULT 'succeeded',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
