// Shared Vimeo HTTP client used by every CI step.
// Centralizes: auth header, JSON parsing, response logging, and the
// "any 4xx/5xx = fail the job" contract.

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const API_BASE = process.env.VIMEO_API_BASE || 'https://api.vimeo.com';
const TOKEN = process.env.VIMEO_ACCESS_TOKEN;
const LOG_DIR = process.env.LOG_DIR || path.join(process.cwd(), 'vimeo-logs');

if (!TOKEN) {
  console.error('::error::VIMEO_ACCESS_TOKEN is not set');
  process.exit(1);
}

fs.mkdirSync(LOG_DIR, { recursive: true });

/**
 * Perform an authenticated request against the Vimeo API and persist the
 * full response (status, headers, body) to LOG_DIR for downstream debugging.
 *
 * @param {string} label       Short tag used in logs and GitHub annotations.
 * @param {string} pathOrUrl   Path (e.g. "/me") or absolute URL.
 * @param {object} [opts]      fetch options + optional `expectStatus`.
 * @returns {Promise<{status:number, body:any, headers:object, url:string}>}
 * @throws  When the response is 4xx/5xx or doesn't match `expectStatus`.
 */
async function vimeoRequest(label, pathOrUrl, opts = {}) {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${API_BASE}${pathOrUrl}`;
  const headers = {
    Accept: 'application/vnd.vimeo.*+json;version=3.4',
    'Content-Type': 'application/json',
    ...(opts.noAuth ? {} : { Authorization: `Bearer ${TOKEN}` }),
    ...(opts.headers || {}),
  };

  const started = Date.now();
  let res, rawText, body;
  try {
    res = await fetch(url, { ...opts, headers });
    rawText = await res.text();
    try { body = rawText ? JSON.parse(rawText) : null; }
    catch { body = rawText; }
  } catch (err) {
    // Network-level failure — log and fail the step.
    writeLog(label, {
      ok: false,
      url,
      method: opts.method || 'GET',
      error: err.message,
      durationMs: Date.now() - started,
    });
    console.error(`::error title=Vimeo ${label} network error::${err.message}`);
    process.exit(1);
  }

  const durationMs = Date.now() - started;
  const ok = opts.expectStatus
    ? res.status === opts.expectStatus
    : res.status >= 200 && res.status < 300;

  const logEntry = {
    ok,
    label,
    url,
    method: opts.method || 'GET',
    status: res.status,
    statusText: res.statusText,
    durationMs,
    requestId: res.headers.get('x-request-id'),
    rateLimitRemaining: res.headers.get('x-ratelimit-remaining'),
    response: body,
  };
  writeLog(label, logEntry);

  // Always print a one-line summary to the workflow log.
  console.log(
    `[vimeo:${label}] ${opts.method || 'GET'} ${url} → ${res.status} (${durationMs}ms)`
  );

  if (!ok) {
    // Full body to stdout so it shows up in the GitHub Actions log directly.
    console.error('::group::Full response body');
    console.error(JSON.stringify(body, null, 2));
    console.error('::endgroup::');
    console.error(
      `::error title=Vimeo ${label} failed::HTTP ${res.status} ${res.statusText} from ${url}`
    );
    const err = new Error(`Vimeo ${label} returned ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return { status: res.status, body, headers: res.headers, url };
}

function writeLog(label, entry) {
  const safe = label.replace(/[^a-z0-9_-]+/gi, '_');
  const id = crypto.randomBytes(3).toString('hex');
  const file = path.join(LOG_DIR, `${safe}-${id}.json`);
  fs.writeFileSync(file, JSON.stringify(entry, null, 2));
}

module.exports = { vimeoRequest, API_BASE, LOG_DIR };
