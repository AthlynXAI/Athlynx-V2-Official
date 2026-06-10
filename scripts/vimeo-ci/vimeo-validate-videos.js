#!/usr/bin/env node
// Step 2 — validate every existing video ID from VIMEO_TEST_VIDEO_IDS
// returns a 200 and still has the fields the player relies on.

'use strict';

const { vimeoRequest } = require('./_vimeo-client');

const REQUIRED_FIELDS = ['uri', 'name', 'status', 'files', 'player_embed_url'];

(async () => {
  const raw = process.env.VIMEO_TEST_VIDEO_IDS || '';
  const ids = raw.split(',').map(s => s.trim()).filter(Boolean);

  if (ids.length === 0) {
    console.error('::error::VIMEO_TEST_VIDEO_IDS is empty');
    process.exit(1);
  }

  console.log(`[vimeo:validate] checking ${ids.length} video(s): ${ids.join(', ')}`);

  let failures = 0;
  for (const id of ids) {
    try {
      const { body } = await vimeoRequest(
        `video-${id}`,
        `/videos/${encodeURIComponent(id)}?fields=${REQUIRED_FIELDS.join(',')}`
      );
      const missing = REQUIRED_FIELDS.filter(f => !(f in body));
      if (missing.length) {
        console.error(
          `::error title=Video ${id} schema drift::missing fields: ${missing.join(', ')}`
        );
        failures++;
      }
    } catch {
      failures++;
    }
  }

  if (failures > 0) {
    console.error(`::error::${failures}/${ids.length} video lookups failed`);
    process.exit(1);
  }
  console.log(`[vimeo:validate] all ${ids.length} videos OK`);
})();
