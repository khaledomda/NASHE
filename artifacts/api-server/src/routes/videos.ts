import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import {
  db,
  videosTable,
  athletesTable,
  insertAthleteSchema,
  MAX_VIDEO_SECONDS,
  sportCodeLetter,
  toPublicAthlete,
  type Video,
} from "@workspace/db";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

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

  const videos = await db
    .select()
    .from(videosTable)
    .where(and(...conditions))
    .orderBy(desc(videosTable.uploadedAt))
    .limit(100);

  res.json({ videos });
});

// ─── POST /videos — upload a clip (creates/reuses athlete profile + video row) ──
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
