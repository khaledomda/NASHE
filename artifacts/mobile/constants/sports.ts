export type SportId =
  | 'football'
  | 'basketball'
  | 'volleyball'
  | 'athletics'
  | 'swimming'
  | 'padel'
  | 'handball'
  | 'judo'
  | 'tennis'
  | 'gymnastics';

export type Sport = {
  id: SportId;
  code: string; // first letter used in video codes, e.g. F1
  nameAr: string;
  nameEn: string;
  icon: string; // Ionicons / MaterialCommunityIcons name
  iconSet: 'ion' | 'mci';
};

// Ordered with football first, then the most common sports in Saudi Arabia / the Gulf & Middle East.
export const SPORTS: Sport[] = [
  { id: 'football', code: 'F', nameAr: 'كرة القدم', nameEn: 'Football', icon: 'football-outline', iconSet: 'ion' },
  { id: 'basketball', code: 'B', nameAr: 'كرة السلة', nameEn: 'Basketball', icon: 'basketball-outline', iconSet: 'ion' },
  { id: 'volleyball', code: 'V', nameAr: 'الكرة الطائرة', nameEn: 'Volleyball', icon: 'volleyball', iconSet: 'mci' },
  { id: 'athletics', code: 'A', nameAr: 'ألعاب القوى', nameEn: 'Athletics', icon: 'run', iconSet: 'mci' },
  { id: 'swimming', code: 'S', nameAr: 'السباحة', nameEn: 'Swimming', icon: 'swim-outline', iconSet: 'ion' },
  { id: 'padel', code: 'P', nameAr: 'البادل', nameEn: 'Padel', icon: 'tennisball-outline', iconSet: 'ion' },
  { id: 'handball', code: 'H', nameAr: 'كرة اليد', nameEn: 'Handball', icon: 'handball', iconSet: 'mci' },
  { id: 'judo', code: 'J', nameAr: 'الجودو', nameEn: 'Judo', icon: 'karate', iconSet: 'mci' },
  { id: 'tennis', code: 'T', nameAr: 'التنس', nameEn: 'Tennis', icon: 'tennisball-outline', iconSet: 'ion' },
  { id: 'gymnastics', code: 'G', nameAr: 'الجمباز', nameEn: 'Gymnastics', icon: 'gymnastics', iconSet: 'mci' },
];

export function sportName(sport: Sport, lang: 'ar' | 'en') {
  return lang === 'ar' ? sport.nameAr : sport.nameEn;
}

export function getSport(id: SportId): Sport {
  return SPORTS.find((s) => s.id === id) ?? SPORTS[0];
}
