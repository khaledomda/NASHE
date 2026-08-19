import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiLogin, apiLogout, apiRegister, getToken, ApiError, type PublicUser, type UserRole } from '@/lib/api';

export type { UserRole };

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  username: string;
  role: UserRole;
  userId: string | null;
  lastUploadAt: string | null;
  /** Returns an error message on failure, or null on success. */
  login: (username: string, password: string) => Promise<string | null>;
  /** Returns an error message on failure, or null on success. */
  register: (input: { username: string; password: string; role: UserRole; phone?: string; email?: string }) => Promise<string | null>;
  logout: () => Promise<void>;
  canUploadThisWeek: () => boolean;
  recordUpload: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const PROFILE_KEY = '@nashe_profile_v3';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

type StoredProfile = { user: PublicUser; lastUploadAt: string | null };

function friendlyError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    const detail =
      (err.data as { error?: string } | null)?.error ??
      (err.status === 401
        ? fallback
        : err.status === 409
          ? 'That username is already taken.'
          : err.status === 0 || err.status >= 500
            ? "Couldn't reach the server. Check your connection and try again."
            : fallback);
    return detail;
  }
  return fallback;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [lastUploadAt, setLastUploadAt] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [token, raw] = await Promise.all([getToken(), AsyncStorage.getItem(PROFILE_KEY)]);
        if (token && raw) {
          const profile = JSON.parse(raw) as StoredProfile;
          setUser(profile.user);
          setLastUploadAt(profile.lastUploadAt);
          setIsLoggedIn(true);
        }
      } catch {
        // Corrupt/missing local profile — fall through to logged-out state.
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = async (profile: StoredProfile) => {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  };

  const login = async (usernameInput: string, password: string): Promise<string | null> => {
    if (!usernameInput.trim() || !password.trim()) return 'Please enter your username and password.';
    try {
      const { user: loggedInUser } = await apiLogin(usernameInput.trim(), password);
      await persist({ user: loggedInUser, lastUploadAt: null });
      setUser(loggedInUser);
      setLastUploadAt(null);
      setIsLoggedIn(true);
      return null;
    } catch (err) {
      return friendlyError(err, 'Login failed. Check your username and password.');
    }
  };

  const register = async (input: {
    username: string;
    password: string;
    role: UserRole;
    phone?: string;
    email?: string;
  }): Promise<string | null> => {
    if (!input.username.trim() || input.password.length < 8) {
      return 'Username is required and password must be at least 8 characters.';
    }
    try {
      const { user: newUser } = await apiRegister({ ...input, username: input.username.trim() });
      await persist({ user: newUser, lastUploadAt: null });
      setUser(newUser);
      setLastUploadAt(null);
      setIsLoggedIn(true);
      return null;
    } catch (err) {
      return friendlyError(err, 'Registration failed. Please try again.');
    }
  };

  const logout = async () => {
    await apiLogout();
    await AsyncStorage.removeItem(PROFILE_KEY);
    setIsLoggedIn(false);
    setUser(null);
    setLastUploadAt(null);
  };

  // Client-side approximation of the 1-video-per-week rule, purely so the UI
  // can disable the upload button immediately. The server re-enforces this
  // independently (see POST /videos) since the client can't be trusted.
  const canUploadThisWeek = () => {
    if (!lastUploadAt) return true;
    return Date.now() - new Date(lastUploadAt).getTime() >= WEEK_MS;
  };

  const recordUpload = async () => {
    const now = new Date().toISOString();
    setLastUploadAt(now);
    if (user) await persist({ user, lastUploadAt: now });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        username: user?.username ?? '',
        role: user?.role ?? 'visitor',
        userId: user?.id ?? null,
        lastUploadAt,
        login,
        register,
        logout,
        canUploadThisWeek,
        recordUpload,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
