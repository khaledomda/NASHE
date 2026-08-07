import { pgTable, text, timestamp, uuid, pgEnum, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const genderEnum = pgEnum("gender", ["male", "female"]);

// One row per athlete profile. A single account (uploaderId) may create
// multiple athlete profiles over time (e.g. uploading for more than one child).
export const athletesTable = pgTable("athletes", {
  id: uuid("id").primaryKey().defaultRandom(),
  uploaderId: uuid("uploader_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  birthDate: date("birth_date").notNull(),
  region: text("region").notNull(),
  gender: genderEnum("gender").notNull(),

  // Guardian consent — required for every athlete profile.
  // Visible to admins only; never exposed in public/scout-facing responses.
  guardianPhone: text("guardian_phone").notNull(),
  guardianConsent: boolean("guardian_consent").notNull().default(false),
  guardianConsentAt: timestamp("guardian_consent_at").notNull().defaultNow(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAthleteSchema = createInsertSchema(athletesTable)
  .omit({ id: true, createdAt: true, guardianConsentAt: true })
  .extend({
    // Guardian consent must be explicitly true at submission time — the API
    // rejects the request rather than silently defaulting this to false.
    guardianConsent: z.literal(true),
    guardianPhone: z.string().min(8, "Guardian phone number is required"),
  });
export type InsertAthlete = z.infer<typeof insertAthleteSchema>;
export type Athlete = typeof athletesTable.$inferSelect;

// Safe subset for scouts/visitors — strips guardian contact details.
export type PublicAthlete = Omit<Athlete, "guardianPhone" | "guardianConsent" | "guardianConsentAt">;
export function toPublicAthlete(athlete: Athlete): PublicAthlete {
  const { guardianPhone, guardianConsent, guardianConsentAt, ...rest } = athlete;
  return rest;
}
