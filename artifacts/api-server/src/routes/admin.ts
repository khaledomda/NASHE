import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { db, videosTable, athletesTable, usersTable } from "@workspace/db";
import { requireAuth, requireRole } from "../middlewares/auth";

const router: IRouter = Router();

// Every route below is admin-only. This is where guardian phone numbers,
// uploader accounts, and contact info are ever exposed by the API.
router.use(requireAuth, requireRole("admin"));

// ─── GET /admin/videos/pending ────────────────────────────────────────────────
router.get("/admin/videos/pending", async (_req, res) => {
  const pending = await db
    .select({
      video: videosTable,
      athlete: athletesTable,
    })
    .from(videosTable)
    .innerJoin(athletesTable, eq(videosTable.athleteId, athletesTable.id))
    .where(eq(videosTable.status, "pending"));

  res.json({ pending });
});

// ─── POST /admin/videos/:id/approve ───────────────────────────────────────────
router.post("/admin/videos/:id/approve", async (req, res) => {
  const [updated] = await db
    .update(videosTable)
    .set({ status: "approved", reviewedAt: new Date(), reviewedBy: req.user!.sub })
    .where(eq(videosTable.id, req.params.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Video not found" });
    return;
  }
  res.json({ video: updated });
});

// ─── POST /admin/videos/:id/reject ────────────────────────────────────────────
const rejectSchema = z.object({ reason: z.string().optional() });

router.post("/admin/videos/:id/reject", async (req, res) => {
  const parsed = rejectSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [updated] = await db
    .update(videosTable)
    .set({ status: "rejected", reviewedAt: new Date(), reviewedBy: req.user!.sub })
    .where(eq(videosTable.id, req.params.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Video not found" });
    return;
  }
  res.json({ video: updated });
});

// ─── GET /admin/contacts ──────────────────────────────────────────────────────
// The only endpoint that returns guardian phone numbers and uploader accounts.
router.get("/admin/contacts", async (_req, res) => {
  const rows = await db
    .select({
      athleteId: athletesTable.id,
      athleteName: athletesTable.name,
      guardianPhone: athletesTable.guardianPhone,
      guardianConsent: athletesTable.guardianConsent,
      uploaderUsername: usersTable.username,
      uploaderPhone: usersTable.phone,
      uploaderEmail: usersTable.email,
    })
    .from(athletesTable)
    .innerJoin(usersTable, eq(athletesTable.uploaderId, usersTable.id));

  res.json({ contacts: rows });
});

export default router;
