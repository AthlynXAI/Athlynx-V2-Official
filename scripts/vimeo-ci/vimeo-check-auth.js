#!/usr/bin/env node
// Step 1 — confirm the token still authenticates after the rebase.
// /me is the cheapest endpoint that exercises the same auth path the
// React Native player uses at runtime.

'use strict';

const { vimeoRequest } = require('./_vimeo-client');

(async () => {
  try {
    const { body } = await vimeoRequest('auth-me', '/me');
    if (!body || !body.uri) {
      console.error('::error::/me returned 200 but no `uri` — token scopes may be wrong');
      process.exit(1);
    }
    console.log(`[vimeo:auth-me] authenticated as ${body.name} (${body.uri})`);
  } catch (e) {
    process.exit(1);
  }
})();
