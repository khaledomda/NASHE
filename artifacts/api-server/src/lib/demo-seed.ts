import { and, eq } from "drizzle-orm";
import {
  db,
  athletesTable,
  usersTable,
  videosTable,
  type UserRole,
} from "@workspace/db";
import { hashPassword } from "./auth";

const DEMO_PROFILES: Array<{
  username: string;
  name: string;
  sport:
    | "football"
    | "basketball"
    | "swimming"
    | "tennis"
    | "padel"
    | "volleyball"
    | "handball"
    | "athletics"
    | "judo"
    | "gymnastics";
  gender: "male" | "female";
  region: string;
  description: string;
  durationSec: number;
  videoUrl: string;
}> = [
  {
    username: "demo_omar",
    name: "Omar Al-Najdi",
    sport: "football",
    gender: "male",
    region: "Riyadh",
    description: "Demo clip · Quick footwork and close control",
    durationSec: 18,
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    username: "demo_lina",
    name: "Lina Al-Harbi",
    sport: "basketball",
    gender: "female",
    region: "Jeddah",
    description: "Demo clip · Confident shooting form",
    durationSec: 22,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    username: "demo_yousef",
    name: "Yousef Al-Qahtani",
    sport: "swimming",
    gender: "male",
    region: "Dammam",
    description: "Demo clip · Strong freestyle technique",
    durationSec: 16,
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
  },
  {
    username: "demo_noura",
    name: "Noura Al-Salem",
    sport: "tennis",
    gender: "female",
    region: "Madinah",
    description: "Demo clip · Fast movement and clean forehand",
    durationSec: 20,
    videoUrl: "https://media.w3.org/2010/05/bunny/trailer.mp4",
  },
  {
    username: "demo_faisal",
    name: "Faisal Al-Rashed",
    sport: "padel",
    gender: "male",
    region: "Riyadh",
    description: "Demo clip · Quick reactions at the glass",
    durationSec: 19,
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    username: "demo_maya",
    name: "Maya Al-Otaibi",
    sport: "volleyball",
    gender: "female",
    region: "Khobar",
    description: "Demo clip · Powerful jump serve",
    durationSec: 21,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    username: "demo_tariq",
    name: "Tariq Al-Mansour",
    sport: "handball",
    gender: "male",
    region: "Abha",
    description: "Demo clip · Fast break finishing",
    durationSec: 17,
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
  },
  {
    username: "demo_sara",
    name: "Sara Al-Fahad",
    sport: "football",
    gender: "female",
    region: "Riyadh",
    description: "Demo clip · Creative passing sequence",
    durationSec: 24,
    videoUrl: "https://media.w3.org/2010/05/bunny/trailer.mp4",
  },
  {
    username: "demo_hamad",
    name: "Hamad Al-Dosari",
    sport: "basketball",
    gender: "male",
    region: "Jeddah",
    description: "Demo clip · Smooth dribbling drill",
    durationSec: 23,
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    username: "demo_reem",
    name: "Reem Al-Shammari",
    sport: "padel",
    gender: "female",
    region: "Dammam",
    description: "Demo clip · Controlled rally practice",
    durationSec: 18,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    username: "demo_athletics_m",
    name: "Demo Athletics M",
    sport: "athletics",
    gender: "male",
    region: "Riyadh",
    description: "Demo clip · Sprint technique",
    durationSec: 20,
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
  },
  {
    username: "demo_athletics_f",
    name: "Demo Athletics F",
    sport: "athletics",
    gender: "female",
    region: "Jeddah",
    description: "Demo clip · Hurdle rhythm",
    durationSec: 22,
    videoUrl: "https://media.w3.org/2010/05/bunny/trailer.mp4",
  },
  {
    username: "demo_swimming_f",
    name: "Demo Swimming F",
    sport: "swimming",
    gender: "female",
    region: "Dammam",
    description: "Demo clip · Freestyle turn",
    durationSec: 19,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    username: "demo_volleyball_m",
    name: "Demo Volleyball M",
    sport: "volleyball",
    gender: "male",
    region: "Abha",
    description: "Demo clip · Blocking drill",
    durationSec: 18,
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    username: "demo_handball_f",
    name: "Demo Handball F",
    sport: "handball",
    gender: "female",
    region: "Madinah",
    description: "Demo clip · Fast passing sequence",
    durationSec: 21,
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
  },
  {
    username: "demo_judo_m",
    name: "Demo Judo M",
    sport: "judo",
    gender: "male",
    region: "Taif",
    description: "Demo clip · Balance and movement",
    durationSec: 17,
    videoUrl: "https://media.w3.org/2010/05/bunny/trailer.mp4",
  },
  {
    username: "demo_judo_f",
    name: "Demo Judo F",
    sport: "judo",
    gender: "female",
    region: "Khobar",
    description: "Demo clip · Focused footwork",
    durationSec: 16,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    username: "demo_tennis_m",
    name: "Demo Tennis M",
    sport: "tennis",
    gender: "male",
    region: "Riyadh",
    description: "Demo clip · Serve practice",
    durationSec: 20,
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    username: "demo_gymnastics_m",
    name: "Demo Gymnastics M",
    sport: "gymnastics",
    gender: "male",
    region: "Jeddah",
    description: "Demo clip · Balance routine",
    durationSec: 23,
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
  },
  {
    username: "demo_gymnastics_f",
    name: "Demo Gymnastics F",
    sport: "gymnastics",
    gender: "female",
    region: "Makkah",
    description: "Demo clip · Floor routine",
    durationSec: 24,
    videoUrl: "https://media.w3.org/2010/05/bunny/trailer.mp4",
  },
];

/**
 * Seeds fictional showcase clips only when explicitly enabled for a deployment.
 * This is idempotent so a restart cannot duplicate demo accounts or videos.
 */
export async function seedDemoData() {
  if (process.env.SEED_DEMO_DATA !== "true") return;

  for (const [index, demo] of DEMO_PROFILES.entries()) {
    let user = await db.query.usersTable.findFirst({
      where: eq(usersTable.username, demo.username),
    });

    if (!user) {
      const passwordHash = await hashPassword("NasheDemo123");
      [user] = await db
        .insert(usersTable)
        .values({
          username: demo.username,
          passwordHash,
          role: "visitor" satisfies UserRole,
          email: `${demo.username}@demo.nashe.sa`,
        })
        .returning();
    }

    const existingVideo = await db.query.videosTable.findFirst({
      where: and(
        eq(videosTable.uploaderId, user.id),
        eq(videosTable.code, `DEMO-${index + 1}`),
      ),
    });
    if (existingVideo) continue;

    const [athlete] = await db
      .insert(athletesTable)
      .values({
        uploaderId: user.id,
        name: demo.name,
        birthDate: "2010-01-01",
        region: demo.region,
        gender: demo.gender,
        guardianPhone: "0000000000",
        guardianConsent: true,
      })
      .returning();

    await db.insert(videosTable).values({
      code: `DEMO-${index + 1}`,
      sport: demo.sport,
      gender: demo.gender,
      athleteId: athlete.id,
      uploaderId: user.id,
      durationSec: demo.durationSec,
      storageUrl: demo.videoUrl,
      description: demo.description,
      status: "approved",
      views: 42 + index * 19,
      likes: 7 + index * 4,
      reviewedAt: new Date(),
    });
  }
}