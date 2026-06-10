-- Migration 0018: HIPAA + AthlynX Medical Data Waiver Consent
-- Adds consent tracking columns to the users table.
-- Athletes must sign both documents before accessing the platform.
-- hipaaConsentSigned: 1 = signed, 0 = not signed
-- medicalWaiverSigned: 1 = signed, 0 = not signed
-- consentSignedAt: timestamp when consent was completed
-- consentIpAddress: IP address at time of signing (legal record)
-- consentVersion: version of the documents signed (for re-consent on updates)

ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `hipaaConsentSigned` smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `medicalWaiverSigned` smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `athlynxDataWaiverSigned` smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `consentSignedAt` timestamp NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `consentIpAddress` varchar(64) NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `consentVersion` varchar(32) NULL DEFAULT '1.0';
