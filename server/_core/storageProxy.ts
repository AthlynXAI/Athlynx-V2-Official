/**
 * Storage Proxy — AthlynX
 * Serves uploaded assets via AWS S3 presigned URLs.
 * NO storage routing. NO forgeApiUrl. NO forgeApiKey.
 * Route: GET /storage/:key  →  redirects to S3 presigned URL
 */
import type { Application, Request, Response } from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Client(): S3Client | null {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-1";
  if (!accessKeyId || !secretAccessKey) return null;
  return new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
}

export function registerStorageProxy(app: Application) {
  // Serve stored assets — redirects to a presigned S3 URL
  app.get("/storage/:key(*)", async (req: Request, res: Response) => {
    const key = req.params.key;
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    const s3 = getS3Client();
    const bucket = process.env.AWS_S3_BUCKET;

    if (!s3 || !bucket) {
      // If S3 not configured, return 404 gracefully
      res.status(404).json({ error: "Storage not configured" });
      return;
    }

    try {
      const command = new GetObjectCommand({ Bucket: bucket, Key: key });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] Failed to generate presigned URL:", err);
      res.status(502).send("Storage error");
    }
  });
}
