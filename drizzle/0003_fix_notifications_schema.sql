-- Migration 0003: Fix notifications table schema mismatch
-- The original migration (0000) created notifications with:
--   body TEXT, isRead BOOLEAN, relatedId INT
-- The current codebase expects:
--   message TEXT, isRead ENUM('yes','no'), link VARCHAR(500),
--   imageUrl VARCHAR(500), priority ENUM, isDismissed ENUM,
--   isBroadcast ENUM, expiresAt TIMESTAMP, readAt TIMESTAMP
--
-- This migration brings the live PlanetScale table in sync with schema.ts.

-- 1. Rename body → message (safe: just a rename)
ALTER TABLE `notifications`
  CHANGE COLUMN `body` `message` text;

-- 2. Change isRead from BOOLEAN to ENUM('yes','no')
--    Map: false → 'no', true → 'yes'
ALTER TABLE `notifications`
  MODIFY COLUMN `isRead` enum('yes','no') NOT NULL DEFAULT 'no';

-- 3. Add missing columns (all nullable or with defaults so existing rows are unaffected)
ALTER TABLE `notifications`
  ADD COLUMN IF NOT EXISTS `link` varchar(500) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `imageUrl` varchar(500) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `priority` enum('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS `isDismissed` enum('yes','no') NOT NULL DEFAULT 'no',
  ADD COLUMN IF NOT EXISTS `isBroadcast` enum('yes','no') NOT NULL DEFAULT 'no',
  ADD COLUMN IF NOT EXISTS `expiresAt` timestamp DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `readAt` timestamp DEFAULT NULL;

-- 4. Drop the old relatedId column (not in current schema)
ALTER TABLE `notifications`
  DROP COLUMN IF EXISTS `relatedId`;

-- 5. Change type column from varchar(64) to the correct enum
--    First set any unknown values to 'custom' so the MODIFY doesn't reject them
UPDATE `notifications`
  SET `type` = 'custom'
  WHERE `type` NOT IN ('welcome','vip_approved','system_announcement','custom','credit_added','new_feature','promotion','reminder','achievement','message');

ALTER TABLE `notifications`
  MODIFY COLUMN `type` enum('welcome','vip_approved','system_announcement','custom','credit_added','new_feature','promotion','reminder','achievement','message') NOT NULL DEFAULT 'custom';

-- 6. Fix title column length (0000 had varchar(256), schema.ts has varchar(255))
ALTER TABLE `notifications`
  MODIFY COLUMN `title` varchar(255) NOT NULL;
