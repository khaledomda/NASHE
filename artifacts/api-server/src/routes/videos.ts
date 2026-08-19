import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import {
  db,
  videosTable,
  athletesTable,
  videoLikesTable,
  insertAthleteSchema,
  MAX_VIDEO_SECONDS,
  sportCodeLetter,
  toPublicAthlete,
  type Video,
} from "@workspace/db";
import { requireAuth, optionalAuth } from "../middlewares/auth";
import { createPresignedVideoUpload, ALLOWED_VIDEO_CONTENT_TYPES } from "../lib/storage";

const router: IRouter = Router();

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

// ─── GET /videos — public feed, approved only, optionally filtered ───────────
const listQuerySchema = z.object({
  sport: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
});

router.get("/videos", async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query" });
    return;
  }
  const { sport, gender } = parsed.data;

  const conditions = [eq(videosTable.status, "approved")];
  if (sport) conditions.push(eq(videosTable.sport, sport as Video["sport"]));
  if (gender) conditions.push(eq(videosTable.gender, gender));

  const rows = await db
    .select({
      video: videosTable,
      athleteName: athletesTable.name,
      athleteRegion: athletesTable.region,
    })
    .from(videosTable)
    .innerJoin(athletesTable, eq(videosTable.athleteId, athletesTable.id))
    .where(and(...conditions))
    .orderBy(desc(videosTable.uploadedAt))
    .limit(100);

  res.json({
    videos: rows.map(({ video, athleteName, athleteRegion }) => ({
      ...video,
      athleteName,
      athleteRegion,
    })),
  });
});

// ─── GET /videos/:id — single video detail (public, but shows "liked by me"
// when a valid token is attached) ──────────────────────────────────────────
router.get("/videos/:id", optionalAuth, async (req, res) => {
  const videoId = routeParam(req.params.id);

  const [row] = await db
    .select({
      video: videosTable,
      athleteName: athletesTable.name,
      athleteRegion: athletesTable.region,
    })
    .from(videosTable)
    .innerJoin(athletesTable, eq(videosTable.athleteId, athletesTable.id))
    .where(and(eq(videosTable.id, videoId), eq(videosTable.status, "approved")))
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "Video not found" });
    return;
  }

  let likedByMe = false;
  if (req.user) {
    const [like] = await db
      .select({ id: videoLikesTable.id })
      .from(videoLikesTable)
      .where(and(eq(videoLikesTable.videoId, videoId), eq(videoLikesTable.userId, req.user.sub)))
      .limit(1);
    likedByMe = Boolean(like);
  }

  res.json({
    video: row.video,
    athleteName: row.athleteName,
    athleteRegion: row.athleteRegion,
    likedByMe,
  });
});

// ─── POST /videos/:id/view — increments the view counter ─────────────────────
// Fire-and-forget from the client when a clip starts playing. Intentionally
// public (no auth) since anonymous browsing is allowed; a production version
// should add per-device/IP rate limiting to blunt trivial view-count spam.
router.post("/videos/:id/view", async (req, res) => {
  const videoId = routeParam(req.params.id);
  const [updated] = await db
    .update(videosTable)
    .set({ views: sql`${videosTable.views} + 1` })
    .where(eq(videosTable.id, videoId))
    .returning({ views: videosTable.views });

  if (!updated) {
    res.status(404).json({ error: "Video not found" });
    return;
  }
  res.json({ views: updated.views });
});

// ─── POST /videos/:id/like — like a video (idempotent) ────────────────────────
router.post("/videos/:id/like", requireAuth, async (req, res) => {
  const videoId = routeParam(req.params.id);
  const userId = req.user!.sub;

  const result = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(videoLikesTable)
      .values({ videoId, userId })
      .onConflictDoNothing()
      .returning();

    if (inserted.length === 0) {
      // Already liked by this user — return the current count untouched.
      const [row] = await tx
        .select({ likes: videosTable.likes })
        .from(videosTable)
        .where(eq(videosTable.id, videoId));
      return { liked: true, likes: row?.likes ?? 0 };
    }

    const [updated] = await tx
      .update(videosTable)
      .set({ likes: sql`${videosTable.likes} + 1` })
      .where(eq(videosTable.id, videoId))
      .returning({ likes: videosTable.likes });

    return { liked: true, likes: updated?.likes ?? 0 };
  });

  res.json(result);
});

// ─── DELETE /videos/:id/like — unlike a video (idempotent) ────────────────────
router.delete("/videos/:id/like", requireAuth, async (req, res) => {
  const videoId = routeParam(req.params.id);
  const userId = req.user!.sub;

  const result = await db.transaction(async (tx) => {
    const deleted = await tx
      .delete(videoLikesTable)
      .where(and(eq(videoLikesTable.videoId, videoId), eq(videoLikesTable.userId, userId)))
      .returning();

    if (deleted.length === 0) {
      const [row] = await tx
        .select({ likes: videosTable.likes })
        .from(videosTable)
        .where(eq(videosTable.id, videoId));
      return { liked: false, likes: row?.likes ?? 0 };
    }

    const [updated] = await tx
      .update(videosTable)
      .set({ likes: sql`GREATEST(${videosTable.likes} - 1, 0)` })
      .where(eq(videosTable.id, videoId))
      .returning({ likes: videosTable.likes });

    return { liked: false, likes: updated?.likes ?? 0 };
  });

  res.json(result);
});

// ─── POST /videos/upload-url — presigned URL for the client to PUT the raw
// video file to object storage, before calling POST /videos to register it ──
const uploadUrlSchema = z.object({
  contentType: z.enum(ALLOWED_VIDEO_CONTENT_TYPES),
});

router.post("/videos/upload-url", requireAuth, async (req, res) => {
  const parsed = uploadUrlSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid or unsupported content type", details: parsed.error.flatten() });
    return;
  }
  try {
    const presigned = await createPresignedVideoUpload(parsed.data.contentType);
    res.json(presigned);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Storage is not configured" });
  }
});

// ─── POST /videos — register a clip (creates/reuses athlete profile + video
// row) after the file has already been uploaded to storage ───────────────────
const uploadSchema = z.object({
  athlete: insertAthleteSchema.omit({ uploaderId: true }),
  sport: z.enum([
    "football",
    "basketball",
    "volleyball",
    "athletics",
    "swimming",
    "padel",
    "handball",
    "judo",
    "tennis",
    "gymnastics",
  ]),
  durationSec: z.number().int().positive(),
  storageUrl: z.string().url(),
  description: z.string().optional(),
});

router.post("/videos", requireAuth, async (req, res) => {
  const parsed = uploadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const userId = req.user!.sub;
  const { athlete, sport, durationSec, storageUrl, description } = parsed.data;

  // Re-check the 45s cap server-side — the client already blocks longer clips,
  // but the client can't be trusted as the source of truth.
  if (durationSec > MAX_VIDEO_SECONDS) {
    res.status(422).json({ error: `Video must not exceed ${MAX_VIDEO_SECONDS} seconds` });
    return;
  }

  // Enforce: 1 upload per account per rolling 7-day window.
  const weekAgo = new Date(Date.now() - WEEK_MS);
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(videosTable)
    .where(and(eq(videosTable.uploaderId, userId), gte(videosTable.uploadedAt, weekAgo)));
  if (count > 0) {
    res.status(429).json({ error: "You can upload only 1 video every week. Please try again later." });
    return;
  }

  const [athleteRow] = await db
    .insert(athletesTable)
    .values({ ...athlete, uploaderId: userId })
    .returning();

  // Generate the next sequential code for this sport, e.g. "F4".
  // NOTE: for correctness under concurrent uploads, this count-then-insert should
  // move to a DB sequence or a transaction with a row lock before going to production.
  const letter = sportCodeLetter(sport);
  const [{ count: sportCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(videosTable)
    .where(eq(videosTable.sport, sport));
  const code = `${letter}${sportCount + 1}`;

  const [video] = await db
    .insert(videosTable)
    .values({
      code,
      sport,
      gender: athlete.gender,
      athleteId: athleteRow.id,
      uploaderId: userId,
      durationSec,
      storageUrl,
      description,
      // Automated content check happens out-of-band (a worker/queue in production);
      // every upload starts as "pending" and requires admin approval either way.
      status: "pending",
    })
    .returning();

  res.status(201).json({ video, athlete: toPublicAthlete(athleteRow) });
});

export default router;
