import { pgTable, text, timestamp, uuid, pgEnum, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { athletesTable, genderEnum } from "./athletes";

export const sportEnum = pgEnum("sport", [
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
]);

export const videoStatusEnum = pgEnum("video_status", [
  "pending", // awaiting admin review (after passing/failing the automated check)
  "approved",
  "flagged", // automated check found possible name/phone number text
  "rejected",
]);

export const MAX_VIDEO_SECONDS = 45;

export const videosTable = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(), // e.g. "F1" — sport letter + sequence number
  sport: sportEnum("sport").notNull(),
  gender: genderEnum("gender").notNull(),
  athleteId: uuid("athlete_id")
    .notNull()
    .references(() => athletesTable.id, { onDelete: "cascade" }),
  uploaderId: uuid("uploader_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  durationSec: integer("duration_sec").notNull(),
  storageUrl: text("storage_url").notNull(),
  description: text("description"),
  status: videoStatusEnum("status").notNull().default("pending"),
  views: integer("views").notNull().default(0),
  // Denormalized like count, kept in sync transactionally by the like/unlike
  // routes (see routes/videos.ts). The source of truth for *who* liked a
  // video is the video_likes table — this column exists purely so feed/list
  // queries don't need a COUNT(*) join on every request.
  likes: integer("likes").notNull().default(0),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: uuid("reviewed_by").references(() => usersTable.id),
});

export const insertVideoSchema = createInsertSchema(videosTable)
  .omit({ id: true, code: true, uploadedAt: true, views: true, likes: true, status: true, reviewedAt: true, reviewedBy: true })
  .extend({
    // Server-side enforcement — mirrors the 45s cap already enforced client-side,
    // but the client cannot be trusted, so this is re-checked here.
    durationSec: z.number().int().positive().max(MAX_VIDEO_SECONDS),
  });
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videosTable.$inferSelect;

const SPORT_CODE: Record<(typeof sportEnum.enumValues)[number], string> = {
  football: "F",
  basketball: "B",
  volleyball: "V",
  athletics: "A",
  swimming: "S",
  padel: "P",
  handball: "H",
  judo: "J",
  tennis: "T",
  gymnastics: "G",
};

export function sportCodeLetter(sport: (typeof sportEnum.enumValues)[number]): string {
  return SPORT_CODE[sport];
}
