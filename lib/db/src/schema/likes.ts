import { pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { videosTable } from "./videos";

// One row per (video, user) like. The unique constraint is what makes
// "like" idempotent — a user can never like the same video twice, so the
// route layer can safely insert-and-ignore-conflict instead of doing a
// read-then-write race.
export const videoLikesTable = pgTable(
  "video_likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    videoId: uuid("video_id")
      .notNull()
      .references(() => videosTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [unique("video_likes_video_user_unique").on(table.videoId, table.userId)],
);

export type VideoLike = typeof videoLikesTable.$inferSelect;
