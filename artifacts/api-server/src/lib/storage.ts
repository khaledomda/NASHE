import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const REQUIRED_ENV = ["S3_BUCKET", "S3_REGION", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"] as const;

function assertConfigured() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Video storage is not configured. Missing env vars: ${missing.join(", ")}. ` +
        `See .env.example — this works with plain AWS S3 or an S3-compatible ` +
        `provider such as Cloudflare R2 (set S3_ENDPOINT for R2).`,
    );
  }
}

let _client: S3Client | null = null;
function client(): S3Client {
  if (_client) return _client;
  assertConfigured();
  _client = new S3Client({
    region: process.env.S3_REGION!,
    // Leave unset for plain AWS S3. Set to e.g.
    // https://<account_id>.r2.cloudflarestorage.com for Cloudflare R2.
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
  return _client;
}

export const ALLOWED_VIDEO_CONTENT_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-m4v",
] as const;
export type AllowedVideoContentType = (typeof ALLOWED_VIDEO_CONTENT_TYPES)[number];

export type PresignedUpload = {
  uploadUrl: string; // client PUTs the raw video bytes here
  publicUrl: string; // stored as videos.storageUrl once the upload finishes
  objectKey: string;
};

/**
 * Generates a short-lived presigned PUT URL. The mobile client uploads the
 * video binary directly to the bucket (bypassing our server for the large
 * transfer), then confirms by calling POST /videos with `publicUrl` as
 * `storageUrl`.
 */
export async function createPresignedVideoUpload(
  contentType: AllowedVideoContentType,
): Promise<PresignedUpload> {
  const bucket = process.env.S3_BUCKET!;
  const objectKey = `videos/${randomUUID()}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(client(), command, { expiresIn: 300 });

  const publicUrl = process.env.S3_PUBLIC_BASE_URL
    ? `${process.env.S3_PUBLIC_BASE_URL.replace(/\/+$/, "")}/${objectKey}`
    : `https://${bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${objectKey}`;

  return { uploadUrl, publicUrl, objectKey };
}
