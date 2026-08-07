import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db, usersTable, toPublicUser } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken } from "../lib/auth";

const router: IRouter = Router();

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  role: z.enum(["visitor", "scout", "admin"]).default("visitor"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

// NOTE: in production, restrict who can self-register as "admin" (e.g. invite-only,
// or require an existing admin to promote a user) — this scaffold allows it for
// simplicity while there's no admin yet to bootstrap the system.
router.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const { username, password, role, phone, email } = parsed.data;

  const existing = await db.query.usersTable.findFirst({ where: eq(usersTable.username, username) });
  if (existing) {
    res.status(409).json({ error: "Username already taken" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({ username, passwordHash, role, phone, email })
    .returning();

  const token = signToken({ sub: user.id, role: user.role, username: user.username });
  res.status(201).json({ token, user: toPublicUser(user) });
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { username, password } = parsed.data;

  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.username, username) });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const token = signToken({ sub: user.id, role: user.role, username: user.username });
  res.json({ token, user: toPublicUser(user) });
});

export default router;
