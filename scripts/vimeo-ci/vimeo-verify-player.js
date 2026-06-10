#!/usr/bin/env node
// Step 4 — verify the player config endpoint.
//
// The RN player loads `player.vimeo.com/video/<id>/config` to get HLS
// manifest URLs, captions, and DRM hints. A rebase that breaks auth
// header forwarding or the player URL builder will show up here even
// if /videos/<id> still works.

'use strict';

const { vimeoRequest } = require('./_vimeo-client');

const REQUIRED_KEYS = ['video', 'request']; // `request.files.hls` carries the manifest URL

(async () => {
  const raw = process.env.VIMEO_TEST_VIDEO_IDS || '';
  const ids = raw.split(',').map(s => s.trim()).filter(Boolean);
  if (ids.length === 0) {
    console.error('::error::VIMEO_TEST_VIDEO_IDS is empty');
    process.exit(1);
  }

  // Use the first ID — checking one is enough for the player path.
  const id = ids[0];
  // VIMEO_PLAYER_BASE override lets us point at a mock during dry runs.
  // In production CI this stays unset, so we hit the real player.vimeo.com.
  const playerBase = process.env.VIMEO_PLAYER_BASE || 'https://player.vimeo.com';
  const url = `${playerBase}/video/${encodeURIComponent(id)}/config`;

  try {
    // player.vimeo.com/.../config is public — no bearer token needed.
    const { body } = await vimeoRequest('player-config', url, { noAuth: true });

    const missing = REQUIRED_KEYS.filter(k => !(k in body));
    if (missing.length) {
      console.error(
        `::error title=Player config schema drift::missing keys: ${missing.join(', ')}`
      );
      process.exit(1);
    }

    const hls =
      body.request && body.request.files && body.request.files.hls && body.request.files.hls.cdns;
    if (!hls || Object.keys(hls).length === 0) {
      console.error('::error::Player config returned no HLS CDNs — playback would fail on device');
      process.exit(1);
    }

    console.log(
      `[vimeo:player-config] ${id} OK — ${Object.keys(hls).length} HLS CDN(s) available`
    );
  } catch {
    process.exit(1);
  }
})();
