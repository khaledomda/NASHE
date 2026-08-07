import { Router, type IRouter } from "express";
import { eq, gte, sql } from "drizzle-orm";
import { db, sessionsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

// Consider a session "active" if it has pinged within the last 5 minutes.
const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

// The app calls this periodically (e.g. every 60s while open) to mark the
// current user as active. Upserts a session row per user.
router.post("/stats/heartbeat", requireAuth, async (req, res) => {
  const userId = req.user!.sub;
  const existing = await db.query.sessionsTable.findFirst({
    where: eq(sessionsTable.userId, userId),
  });

  if (existing) {
    await db.update(sessionsTable).set({ lastSeenAt: new Date() }).where(eq(sessionsTable.id, existing.id));
  } else {
    await db.insert(sessionsTable).values({ userId });
  }

  res.status(204).end();
});

// Public — powers the "active users" counter shown in the app.
router.get("/stats/active-users", async (_req, res) => {
  const since = new Date(Date.now() - ACTIVE_WINDOW_MS);
  const [{ count }] = await db
    .select({ count: sql<number>`count(distinct ${sessionsTable.userId})::int` })
    .from(sessionsTable)
    .where(gte(sessionsTable.lastSeenAt, since));

  res.json({ activeUsers: count });
});

export default router;
