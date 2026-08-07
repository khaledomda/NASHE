import { SportId } from './sports';

export type Gender = 'male' | 'female';
export type ModerationStatus = 'approved' | 'pending' | 'flagged';

export type Video = {
  id: string;
  code: string; // e.g. "F1" — sport letter + upload sequence number
  sport: SportId;
  gender: Gender;
  athleteName: string;
  region: string;
  durationSec: number; // always <= 45
  views: number;
  color: string;
  status: ModerationStatus;
  uploadedAt: string;
};

// Mock feed data — grouped so the UI can render one list per sport, split by gender.
export const VIDEOS: Video[] = [
  { id: '1', code: 'F1', sport: 'football', gender: 'male', athleteName: 'فيصل الجريني', region: 'الرياض', durationSec: 42, views: 1280, color: '#0F9D68', status: 'approved', uploadedAt: '2026-08-01' },
  { id: '2', code: 'F2', sport: 'football', gender: 'male', athleteName: 'عبدالله القحطاني', region: 'جدة', durationSec: 38, views: 940, color: '#0C7F54', status: 'approved', uploadedAt: '2026-07-29' },
  { id: '3', code: 'F3', sport: 'football', gender: 'female', athleteName: 'لمى العنزي', region: 'الدمام', durationSec: 45, views: 610, color: '#0F9D68', status: 'approved', uploadedAt: '2026-07-27' },
  { id: '4', code: 'B1', sport: 'basketball', gender: 'male', athleteName: 'خالد المطيري', region: 'الرياض', durationSec: 30, views: 720, color: '#F5A524', status: 'approved', uploadedAt: '2026-07-30' },
  { id: '5', code: 'B2', sport: 'basketball', gender: 'female', athleteName: 'جود الحربي', region: 'مكة المكرمة', durationSec: 40, views: 505, color: '#F5A524', status: 'approved', uploadedAt: '2026-07-25' },
  { id: '6', code: 'S1', sport: 'swimming', gender: 'female', athleteName: 'سارة العتيبي', region: 'الرياض', durationSec: 44, views: 1510, color: '#0369A1', status: 'approved', uploadedAt: '2026-08-01' },
  { id: '7', code: 'A1', sport: 'athletics', gender: 'female', athleteName: 'نورة الشمري', region: 'الطائف', durationSec: 35, views: 860, color: '#EC4899', status: 'approved', uploadedAt: '2026-07-26' },
  { id: '8', code: 'T1', sport: 'tennis', gender: 'female', athleteName: 'ريم الزهراني', region: 'جدة', durationSec: 33, views: 410, color: '#7C3AED', status: 'approved', uploadedAt: '2026-07-24' },
  { id: '9', code: 'P1', sport: 'padel', gender: 'male', athleteName: 'سلطان الدوسري', region: 'الرياض', durationSec: 41, views: 300, color: '#3B82F6', status: 'approved', uploadedAt: '2026-07-22' },
];

export function videosBySportAndGender(sport: SportId, gender: Gender): Video[] {
  return VIDEOS.filter((v) => v.sport === sport && v.gender === gender && v.status === 'approved');
}

/** Generates the next code for a sport, e.g. sport letter "F" + next sequence number -> "F4" */
export function nextVideoCode(sportCode: string): string {
  const count = VIDEOS.filter((v) => v.code.startsWith(sportCode)).length;
  return `${sportCode}${count + 1}`;
}

// Mock "active users right now" counter — in production this comes from a live sessions table.
export const ACTIVE_USERS_NOW = 214;
