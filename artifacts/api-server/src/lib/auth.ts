import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { UserRole } from "@workspace/db";

const secretFromEnv = process.env.JWT_SECRET;
if (!secretFromEnv) {
  throw new Error("JWT_SECRET must be set. Generate one with: openssl rand -hex 32");
}
const JWT_SECRET: string = secretFromEnv;

export type AppJwtPayload = {
  sub: string; // user id
  role: UserRole;
  username: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: AppJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): AppJwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded as unknown as AppJwtPayload;
}
