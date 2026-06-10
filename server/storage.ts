/**
 * Storage Service — AthlynX
 * AWS S3 direct upload/download via presigned URLs.
 */
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Client(): S3Client | null {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-1";
  if (!accessKeyId || !secretAccessKey) return null;
  return new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
}

function getBucket(): string { return process.env.AWS_S3_BUCKET || ""; }
function normalizeKey(relKey: string): string { return relKey.replace(/^\/+/, ""); }
function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const segmentStart = relKey.lastIndexOf("/");
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1 || lastDot <= segmentStart) return relKey + "_" + hash;
  return relKey.slice(0, lastDot) + "_" + hash + relKey.slice(lastDot);
}

export async function storagePut(relKey: string, data: Buffer | Uint8Array | string, contentType = "application/octet-stream"): Promise<{ key: string; url: string }> {
  const s3 = getS3Client();
  const bucket = getBucket();
  if (!s3 || !bucket) {
    console.warn("[Storage] AWS S3 not configured — storagePut returning placeholder");
    const key = normalizeKey(relKey);
    return { key, url: "/storage/" + key };
  }
  const key = appendHashSuffix(normalizeKey(relKey));
  const body = typeof data === "string" ? Buffer.from(data, "utf-8") : Buffer.from(data as any);
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
  const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
  const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
  return { key, url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const s3 = getS3Client();
  const bucket = getBucket();
  const key = normalizeKey(relKey);
  if (!s3 || !bucket) {
    console.warn("[Storage] AWS S3 not configured — storageGet returning placeholder");
    return { key, url: "/storage/" + key };
  }
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return { key, url };
}
