-- Build 5 — Fort Knox + Rule Book + Q&A
-- ────────────────────────────────────────────────────────────────────────────

-- 1) Audit log. Every privileged action lands here. Append-only.
CREATE TABLE IF NOT EXISTS audit_logs (
  id              BIGSERIAL PRIMARY KEY,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_user_id   INTEGER,
  actor_email     TEXT,
  actor_ip        TEXT,
  actor_ua        TEXT,
  action          TEXT NOT NULL,
  target_type     TEXT,
  target_id       TEXT,
  status          TEXT NOT NULL DEFAULT 'ok',
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS audit_logs_occurred_at_idx ON audit_logs (occurred_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_actor_email_idx ON audit_logs (actor_email);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs (action);
CREATE INDEX IF NOT EXISTS audit_logs_target_idx ON audit_logs (target_type, target_id);

-- 2) Live Rule Book — editable by master admin, displayed in real time.
CREATE TABLE IF NOT EXISTS rules (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  category         TEXT NOT NULL,
  title            TEXT NOT NULL,
  who              TEXT NOT NULL,
  rule             TEXT NOT NULL,
  athlynx_action   TEXT NOT NULL,
  source_label     TEXT NOT NULL,
  source_url       TEXT NOT NULL,
  severity         TEXT NOT NULL DEFAULT 'medium',  -- 'critical' | 'high' | 'medium'
  sort_order       INTEGER NOT NULL DEFAULT 100,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_by      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS rules_category_idx ON rules (category, sort_order);
CREATE INDEX IF NOT EXISTS rules_active_idx ON rules (is_active);

-- 3) Q&A page — public listening post.
--    Athletes ask, vote, suggest features. Master admin answers.
CREATE TABLE IF NOT EXISTS qa_questions (
  id              BIGSERIAL PRIMARY KEY,
  user_id         INTEGER,                 -- nullable for anonymous
  display_name    TEXT,                    -- 'Anonymous' or real name
  category        TEXT NOT NULL DEFAULT 'general',
                  -- 'question' | 'feature_request' | 'bug' | 'general' | 'love' | 'hate'
  kind            TEXT NOT NULL DEFAULT 'question',
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'open',
                  -- 'open' | 'planned' | 'in_progress' | 'shipped' | 'answered' | 'closed'
  upvotes         INTEGER NOT NULL DEFAULT 0,
  downvotes       INTEGER NOT NULL DEFAULT 0,
  is_pinned       BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden       BOOLEAN NOT NULL DEFAULT FALSE,
  answer          TEXT,
  answered_by     TEXT,
  answered_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS qa_questions_created_at_idx ON qa_questions (created_at DESC);
CREATE INDEX IF NOT EXISTS qa_questions_kind_idx ON qa_questions (kind, status);
CREATE INDEX IF NOT EXISTS qa_questions_upvotes_idx ON qa_questions (upvotes DESC);

CREATE TABLE IF NOT EXISTS qa_votes (
  id              BIGSERIAL PRIMARY KEY,
  question_id     BIGINT NOT NULL REFERENCES qa_questions(id) ON DELETE CASCADE,
  voter_id        INTEGER,
  voter_ip_hash   TEXT,
  direction       SMALLINT NOT NULL,   -- 1 or -1
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS qa_votes_user_q_idx ON qa_votes (question_id, voter_id) WHERE voter_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS qa_votes_ip_q_idx ON qa_votes (question_id, voter_ip_hash) WHERE voter_id IS NULL;

-- 4) Seed the Rule Book with the 19 initial rules.
INSERT INTO rules (slug, category, title, who, rule, athlynx_action, source_label, source_url, severity, sort_order) VALUES
('ncaa-nil', 'NIL — College', 'NCAA Interim NIL Policy', 'Every NCAA athlete (D1, D2, D3)',
 'An NCAA athlete may earn compensation for use of their Name, Image, and Likeness — but cannot accept pay for athletic performance, cannot accept inducements to attend a school, and must disclose deals to their compliance office.',
 'All NIL deals routed through the platform are tagged with the athlete''s school and conference; athletes are reminded to disclose to compliance before signing.',
 'NCAA NIL Policy', 'https://www.ncaa.org/sports/2021/9/15/about-nil-name-image-and-likeness.aspx', 'critical', 10),
('state-nil', 'NIL — State Law', 'State NIL Laws (all 50 states)', 'Every athlete in a state with an NIL statute',
 'State NIL laws preempt NCAA rules where applicable. Each state defines its own disclosure deadlines, booster restrictions, and quid-pro-quo prohibitions. Texas SB 1385, California SB 206, Florida HB 7B, and similar statutes apply.',
 'Athletes select their state at signup; the platform surfaces the applicable state statute on every deal screen.',
 'NCSL State NIL Tracker', 'https://www.ncsl.org/research/education/student-athlete-nil-issues.aspx', 'critical', 20),
('hs-nil', 'NIL — High School', 'High School NIL — State Athletic Association rules', 'Every high school athlete',
 'High school NIL is governed by the state athletic association, not the NCAA. Most states allow it with restrictions; some still prohibit. Texas UIL allows NIL effective 2024 with strict booster and school-mark prohibitions.',
 'High school accounts are flagged; the platform displays state-specific HS NIL rules before any deal is initiated.',
 'UIL Texas NIL', 'https://www.uiltexas.org/policy/nil', 'critical', 30),
('nfhs', 'Amateur Status', 'NFHS — National Federation of State High School Associations', 'Every high school athlete in the US',
 'Amateur status, transfer rules, recruiting limits, and inducement bans are governed by NFHS member associations. Violation can result in loss of eligibility.',
 'Recruiting outreach features include cooling-off windows aligned with NFHS standards.',
 'NFHS', 'https://www.nfhs.org/', 'high', 40),
('ftc-endorsement', 'Advertising', 'FTC Endorsement Guides (16 CFR Part 255)', 'Every athlete posting sponsored content',
 'Any post promoting a brand in exchange for payment, free product, or other consideration must clearly disclose the material connection. #ad, #sponsored, or platform-provided disclosure must be prominent and unambiguous.',
 'Sponsored posts created through ATHLYNX are auto-tagged with the FTC-compliant disclosure; un-tagged posts are flagged for review.',
 'FTC Endorsement Guides', 'https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking', 'critical', 50),
('irs-1099', 'Tax — Federal', 'IRS Form 1099-NEC — Non-Employee Compensation', 'Athletes earning $600+ from NIL in a calendar year',
 'Any payer that compensates a non-employee $600 or more in a calendar year must file Form 1099-NEC with the IRS and provide a copy to the recipient by January 31 of the following year.',
 'ATHLYNX issues 1099-NEC to every athlete paid $600+ through the platform and reports earnings to the IRS.',
 'IRS Form 1099-NEC', 'https://www.irs.gov/forms-pubs/about-form-1099-nec', 'critical', 60),
('irs-w9', 'Tax — Federal', 'IRS Form W-9 / W-8BEN — Taxpayer Identification', 'Every athlete before any NIL payout',
 'Before issuing payment, the payer must collect a completed Form W-9 (US persons) or W-8BEN (foreign persons). Failure to collect triggers 24% backup withholding.',
 'ATHLYNX collects a W-9 or W-8BEN through Stripe Connect onboarding before the first payout. Minor athletes must submit a parent/guardian TIN.',
 'IRS Form W-9', 'https://www.irs.gov/forms-pubs/about-form-w-9', 'critical', 70),
('state-tax', 'Tax — State', 'State income tax + jock tax', 'Athletes in states with income tax',
 'NIL earnings are subject to state income tax in the athlete''s state of residence and, in some cases, every state in which they earn compensation (jock tax).',
 'Year-end summary breaks out income by state where deal activity occurred.',
 'Tax Foundation — State Taxes', 'https://taxfoundation.org/data/all/state/', 'high', 80),
('coppa', 'Minor Protection', 'COPPA — Children''s Online Privacy Protection Act (under 13)', 'Every user under 13',
 'Online services may not collect personal information from a child under 13 without verifiable parental consent. Civil penalties up to $51,744 per violation.',
 'Date of birth captured at signup; under-13 users routed to a parental-consent flow before any data is stored.',
 'FTC — COPPA', 'https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy', 'critical', 90),
('ferpa', 'Minor Protection', 'FERPA — Family Educational Rights and Privacy Act', 'Any athlete whose school shares academic records',
 'Schools that share student education records with a third party must have a written agreement and a legitimate educational interest. Schools violating FERPA risk loss of federal funding.',
 'Schools integrating with ATHLYNX execute a Data Processing Agreement before any record is transmitted. Academic data is never sold, never used for advertising, deleted within 30 days of an athlete''s written request.',
 'US Dept of Ed — FERPA', 'https://studentprivacy.ed.gov/', 'critical', 100),
('safesport', 'Minor Protection', 'US Center for SafeSport + state mandated reporter laws', 'Coaches, trainers, agents, advisors interacting with minor athletes',
 'Adults working with minor athletes are subject to SafeSport training, background check, and mandatory abuse reporting in most states.',
 'Every adult listed as a coach, trainer, agent, or advisor must complete background check and SafeSport certification before contacting any user under 18.',
 'US Center for SafeSport', 'https://uscenterforsafesport.org/', 'high', 110),
('hipaa', 'Health & Privacy', 'HIPAA — Protected Health Information', 'Any athlete entering medical or health information',
 'Protected Health Information handled by a covered entity or business associate must be encrypted, access-controlled, and covered by a Business Associate Agreement with every downstream vendor.',
 'ATHLYNX operates as a non-covered wellness platform in general use. For institutional users handling PHI, a BAA is executed before integration. AWS, Stripe, and Neon BAAs are in process.',
 'HHS — HIPAA', 'https://www.hhs.gov/hipaa/index.html', 'critical', 120),
('ccpa', 'Health & Privacy', 'CCPA / CPRA — California Consumer Privacy Act', 'California residents',
 'California residents may request access, correction, deletion, and opt-out of sale/sharing of personal information.',
 'ATHLYNX does not sell personal information. CCPA opt-out link in the site footer. Requests honored within 45 days.',
 'CA AG — CCPA', 'https://oag.ca.gov/privacy/ccpa', 'high', 130),
('gdpr', 'Health & Privacy', 'GDPR / UK GDPR — EU/UK residents', 'Any EU/UK user',
 'Right of access, rectification, erasure, restriction, portability, objection. Lawful basis required.',
 'GDPR rights honored within 30 days. Lawful basis: contract performance + consent.',
 'GDPR Info', 'https://gdpr-info.eu/', 'high', 140),
('title-ix', 'Equity', 'Title IX — Gender equity in education athletics', 'Every federally-funded school or program',
 'Programs receiving federal funding must provide equal athletic opportunity regardless of sex. NIL access through institutional channels must not discriminate.',
 'School-side NIL tools display deal flow by sex/sport to support compliance reporting. Platform itself is non-discriminatory by design.',
 'ED — Title IX', 'https://www2.ed.gov/about/offices/list/ocr/docs/tix_dis.html', 'high', 150),
('dmca', 'Content & IP', 'DMCA — Copyright takedown procedure', 'Anyone posting copyrighted material',
 'Service providers receive safe-harbor protection under DMCA section 512 by designating a registered DMCA agent and acting promptly on valid takedown notices.',
 'DMCA agent registered with US Copyright Office. Takedown notices submitted to legal@athlynx.ai are processed within 24 business hours.',
 'US Copyright Office — DMCA', 'https://www.copyright.gov/dmca/', 'high', 160),
('music', 'Content & IP', 'Music sync licensing for highlight reels', 'Any athlete posting video with music',
 'Using a commercial recording in a highlight reel requires a sync license from both the publisher and the label. Personal/non-commercial use is not a defense.',
 'ATHLYNX provides a built-in royalty-free music library. User-uploaded music is matched against Content ID; flagged content is removed.',
 'US Copyright Office — Music Licensing', 'https://www.copyright.gov/music-licensing-study/', 'high', 170),
('spam', 'Platform Conduct', 'CAN-SPAM + TCPA — Messaging consent', 'Anyone sending bulk email or SMS through the platform',
 'Commercial email must include unsubscribe and physical address. Marketing SMS requires prior express written consent. TCPA violations: $500-$1,500 per text.',
 'All ATHLYNX outbound email includes unsubscribe + sender address. SMS opt-in is double-confirmed before any send.',
 'FTC — CAN-SPAM', 'https://www.ftc.gov/business-guidance/privacy-security/can-spam', 'high', 180),
('ada', 'Platform Conduct', 'ADA — Web Content Accessibility (WCAG 2.1 AA)', 'Every public-facing page',
 'Public accommodations under the ADA include commercial websites. Courts widely apply WCAG 2.1 AA as the practical standard.',
 'All new public pages targeted to WCAG 2.1 AA. Phase 2 ships full audit + remediation tracker.',
 'ADA.gov', 'https://www.ada.gov/resources/web-guidance/', 'medium', 190)
ON CONFLICT (slug) DO NOTHING;
