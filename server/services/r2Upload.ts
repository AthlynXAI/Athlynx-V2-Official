import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 is S3-compatible. We sign upload URLs server-side and let the
// client PUT the file directly. No file body ever traverses our app server.
//
// Required envs (any one set of these works):
//   CLOUDFLARE_R2_ACCOUNT_ID
//   CLOUDFLARE_R2_ACCESS_KEY_ID
//   CLOUDFLARE_R2_SECRET_ACCESS_KEY
//   CLOUDFLARE_R2_BUCKET (default 'athlynx-media')
//   CLOUDFLARE_R2_PUBLIC_URL (optional CDN domain for read URLs)
// Or, single-token fallback: CLOUDFLARE_R2_TOKEN — used only as a presence flag.

let _client: S3Client | null = null;

function endpoint(): string {
  const acct = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  if (!acct) throw new Error("CLOUDFLARE_R2_ACCOUNT_ID is not configured");
  return `https://${acct}.r2.cloudflarestorage.com`;
}

function getClient(): S3Client {
  if (_client) return _client;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || "";
  const secretAccessKey =
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || "";
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 credentials are not configured");
  }
  _client = new S3Client({
    region: "auto",
    endpoint: endpoint(),
    credentials: { accessKeyId, secretAccessKey },
  });
  return _client;
}

function bucket(): string {
  return process.env.CLOUDFLARE_R2_BUCKET || "athlynx-media";
}

/** Return a pre-signed PUT URL valid for ~15 minutes plus the read URL. */
export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  ttlSeconds: number = 900
): Promise<{ uploadUrl: string; readUrl: string; key: string }> {
  const client = getClient();
  const cmd = new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(client, cmd, { expiresIn: ttlSeconds });
  const publicBase = (process.env.CLOUDFLARE_R2_PUBLIC_URL || "").replace(/\/$/, "");
  const readUrl = publicBase ? `${publicBase}/${key}` : `${endpoint()}/${bucket()}/${key}`;
  return { uploadUrl, readUrl, key };
}

// Telemetry: structured logs via console.error/warn captured by Vercel Log Drains.
// Upgrade path: wire Sentry SDK (server/services/sentry.ts) in Build 2 observability sprint.
