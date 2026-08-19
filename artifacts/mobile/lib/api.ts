import AsyncStorage from '@react-native-async-storage/async-storage';
import { setBaseUrl, setAuthTokenGetter, customFetch, ApiError } from '@workspace/api-client-react';

export { ApiError };

const TOKEN_KEY = '@nashe_token_v1';

// Point this at your deployed api-server. Set EXPO_PUBLIC_API_URL in
// artifacts/mobile/.env (copy from .env.example) — e.g.
//   EXPO_PUBLIC_API_URL=https://your-api.example.com/api
// Falls back to localhost for local development against `pnpm dev` in
// artifacts/api-server.
const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

setBaseUrl(API_BASE);
setAuthTokenGetter(() => AsyncStorage.getItem(TOKEN_KEY));

export async function setToken(token: string | null) {
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

// ─── Types (mirror the api-server response shapes) ─────────────────────────

export type UserRole = 'visitor' | 'scout' | 'admin';

export type PublicUser = {
  id: string;
  username: string;
  role: UserRole;
  phone: string | null;
  email: string | null;
  createdAt: string;
};

export type ApiVideo = {
  id: string;
  code: string;
  sport: string;
  gender: 'male' | 'female';
  athleteId: string;
  durationSec: number;
  storageUrl: string;
  description: string | null;
  status: string;
  views: number;
  likes: number;
  uploadedAt: string;
};

export type FeedVideo = ApiVideo & { athleteName: string; athleteRegion: string };

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function apiRegister(input: {
  username: string;
  password: string;
  role: UserRole;
  phone?: string;
  email?: string;
}) {
  const data = await customFetch<{ token: string; user: PublicUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  await setToken(data.token);
  return data;
}

export async function apiLogin(username: string, password: string) {
  const data = await customFetch<{ token: string; user: PublicUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  await setToken(data.token);
  return data;
}

export async function apiLogout() {
  await setToken(null);
}

// ─── Videos ──────────────────────────────────────────────────────────────────

export async function apiListVideos(params?: { sport?: string; gender?: 'male' | 'female' }) {
  const qs = new URLSearchParams();
  if (params?.sport) qs.set('sport', params.sport);
  if (params?.gender) qs.set('gender', params.gender);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return customFetch<{ videos: FeedVideo[] }>(`/videos${suffix}`);
}

export async function apiGetVideo(id: string) {
  return customFetch<{ video: ApiVideo; athleteName: string; athleteRegion: string; likedByMe: boolean }>(
    `/videos/${id}`
  );
}

export async function apiRecordView(id: string) {
  return customFetch<{ views: number }>(`/videos/${id}/view`, { method: 'POST' });
}

export async function apiLikeVideo(id: string) {
  return customFetch<{ liked: boolean; likes: number }>(`/videos/${id}/like`, { method: 'POST' });
}

export async function apiUnlikeVideo(id: string) {
  return customFetch<{ liked: boolean; likes: number }>(`/videos/${id}/like`, { method: 'DELETE' });
}

export async function apiGetUploadUrl(contentType: string) {
  return customFetch<{ uploadUrl: string; publicUrl: string; objectKey: string }>('/videos/upload-url', {
    method: 'POST',
    body: JSON.stringify({ contentType }),
  });
}

/** Uploads the raw video file directly to object storage via a presigned URL. */
export async function apiUploadVideoFile(uploadUrl: string, fileUri: string, contentType: string) {
  const fileResponse = await fetch(fileUri);
  const blob = await fileResponse.blob();
  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });
  if (!put.ok) {
    throw new Error(`Video upload failed (${put.status})`);
  }
}

export async function apiSubmitVideo(input: {
  athlete: {
    name: string;
    birthDate: string;
    region: string;
    gender: 'male' | 'female';
    guardianPhone: string;
    guardianConsent: true;
  };
  sport: string;
  durationSec: number;
  storageUrl: string;
  description?: string;
}) {
  return customFetch<{ video: ApiVideo; athlete: unknown }>('/videos', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
