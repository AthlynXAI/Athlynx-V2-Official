#!/usr/bin/env node
// Step 3 — simulate a new video upload.
//
// We exercise the *upload init* handshake (POST /me/videos with
// upload.approach=tus). This is the exact call the mobile client makes
// before streaming bytes, so it covers:
//   - OAuth scope (upload)
//   - quota / account state
//   - the player-provisioning response shape the RN player parses
//
// We DO NOT push any actual video bytes — instead we DELETE the
// placeholder video immediately. That keeps the library clean and the
// test idempotent across CI runs.

'use strict';

const { vimeoRequest } = require('./_vimeo-client');

const FOLDER_ID = process.env.VIMEO_TEST_FOLDER_ID || '';
const FAKE_SIZE = 1024 * 1024; // 1 MB — Vimeo only needs a size hint at init.

(async () => {
  const runId = process.env.GITHUB_RUN_ID || Date.now().toString();
  const name = `ci-rebase-smoke-${runId}`;

  // ---- 3a. Initiate upload ------------------------------------------------
  const initBody = {
    upload: {
      approach: 'tus',
      size: FAKE_SIZE,
    },
    name,
    description: 'AthlynXAI CI smoke test — safe to delete.',
    privacy: { view: 'nobody', embed: 'whitelist' },
    ...(FOLDER_ID ? { folder_uri: `/folders/${FOLDER_ID}` } : {}),
  };

  let videoUri, uploadLink;
  try {
    const { body } = await vimeoRequest('upload-init', '/me/videos', {
      method: 'POST',
      body: JSON.stringify(initBody),
      expectStatus: 200,
    });

    videoUri = body && body.uri;
    uploadLink = body && body.upload && body.upload.upload_link;

    if (!videoUri || !uploadLink) {
      console.error(
        '::error::Upload init returned 200 but is missing `uri` or `upload.upload_link`'
      );
      console.error(JSON.stringify(body, null, 2));
      process.exit(1);
    }
    console.log(`[vimeo:upload-init] provisioned ${videoUri}`);
    console.log(`[vimeo:upload-init] tus endpoint: ${uploadLink}`);
  } catch {
    process.exit(1);
  }

  // ---- 3b. Probe the tus endpoint with a HEAD ----------------------------
  // The tus spec says HEAD against the upload_link returns 200 with
  // Upload-Offset and Upload-Length. This validates the player+upload
  // service is reachable end-to-end without sending any bytes.
  try {
    const res = await fetch(uploadLink, {
      method: 'HEAD',
      headers: { 'Tus-Resumable': '1.0.0' },
    });
    console.log(
      `[vimeo:upload-head] HEAD ${uploadLink} → ${res.status} ` +
        `(offset=${res.headers.get('upload-offset')}, length=${res.headers.get('upload-length')})`
    );
    if (res.status >= 400) {
      console.error(`::error::tus HEAD returned ${res.status}`);
      await cleanup(videoUri);
      process.exit(1);
    }
  } catch (err) {
    console.error(`::error::tus HEAD failed: ${err.message}`);
    await cleanup(videoUri);
    process.exit(1);
  }

  // ---- 3c. Clean up the placeholder --------------------------------------
  await cleanup(videoUri);
  console.log('[vimeo:upload] simulated upload completed successfully');
})();

async function cleanup(videoUri) {
  if (!videoUri) return;
  try {
    // DELETE returns 204 No Content on success.
    await vimeoRequest('upload-cleanup', videoUri, {
      method: 'DELETE',
      expectStatus: 204,
    });
    console.log(`[vimeo:upload-cleanup] deleted ${videoUri}`);
  } catch (e) {
    // Cleanup failure shouldn't mask the real test result, but we do
    // want it visible so the library doesn't fill up with smoke videos.
    console.warn(
      `::warning title=Vimeo cleanup failed::Could not delete ${videoUri} — please remove manually`
    );
  }
}
