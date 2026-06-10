#!/usr/bin/env node
import { execSync } from 'node:child_process';

// Canonical owner identity per Chad doctrine (2026-06-09):
//   GitHub: AthlynxChad (chaddozier75@gmail.com)
//   Also accept legacy 'AthlynXAI' name on the same email for in-flight session
//   continuity. Email is the immutable lane.
const CANONICAL_NAME = 'AthlynxChad';
const ACCEPTED_NAMES = ['AthlynxChad', 'AthlynXAI'];
const REQUIRED_EMAIL = 'chaddozier75@gmail.com';

function git(args) {
  return execSync(`git ${args}`, { encoding: 'utf8' }).trim();
}

function fail(message) {
  console.error(`\n[identity-guard] ${message}`);
  console.error(`[identity-guard] Required lane: ${CANONICAL_NAME} <${REQUIRED_EMAIL}>`);
  console.error(`[identity-guard] Fix command: git config user.name "${CANONICAL_NAME}" && git config user.email "${REQUIRED_EMAIL}"`);
  process.exit(1);
}

let name = '';
let email = '';
try {
  name = git('config --get user.name');
  email = git('config --get user.email');
} catch {
  fail('Git identity is missing.');
}

if (!ACCEPTED_NAMES.includes(name) || email !== REQUIRED_EMAIL) {
  fail(`Wrong Git identity detected: ${name || '(empty)'} <${email || '(empty)'}>`);
}

let latestAuthor = '';
let latestEmail = '';
try {
  latestAuthor = git('log -1 --pretty=%an');
  latestEmail = git('log -1 --pretty=%ae');
} catch {
  // Repository may not have commits in some local test contexts.
}

if (latestEmail && latestEmail !== REQUIRED_EMAIL) {
  console.warn(`[identity-guard] Latest commit is not from the required email: ${latestAuthor} <${latestEmail}>`);
  console.warn('[identity-guard] Create the next deploy-trigger commit with the corrected identity before production deployment.');
}

console.log(`[identity-guard] OK: ${name} <${email}>`);
