import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'visitor' | 'scout' | 'admin';

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  username: string;
  role: UserRole;
  lastUploadAt: string | null;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  canUploadThisWeek: () => boolean;
  recordUpload: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = '@nashe_auth_v2';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('visitor');
  const [lastUploadAt, setLastUploadAt] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (val) {
          const data = JSON.parse(val) as {
            username: string;
            role: UserRole;
            lastUploadAt: string | null;
          };
          setIsLoggedIn(true);
          setUsername(data.username ?? '');
          setRole(data.role ?? 'visitor');
          setLastUploadAt(data.lastUploadAt ?? null);
        }
      })
      .catch(() => {
        // ignore
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persist = async (data: { username: string; role: UserRole; lastUploadAt: string | null }) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const login = async (user: string, password: string, selectedRole: UserRole): Promise<boolean> => {
    if (!user.trim() || !password.trim()) return false;
    const data = { username: user.trim(), role: selectedRole, lastUploadAt: null };
    await persist(data);
    setUsername(data.username);
    setRole(data.role);
    setLastUploadAt(null);
    setIsLoggedIn(true);
    return true;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setIsLoggedIn(false);
    setUsername('');
    setRole('visitor');
    setLastUploadAt(null);
  };

  // Client-side approximation of the 1-video-per-week rule.
  // Real enforcement must also happen server-side once the API is live.
  const canUploadThisWeek = () => {
    if (!lastUploadAt) return true;
    return Date.now() - new Date(lastUploadAt).getTime() >= WEEK_MS;
  };

  const recordUpload = async () => {
    const now = new Date().toISOString();
    setLastUploadAt(now);
    await persist({ username, role, lastUploadAt: now });
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, username, role, lastUploadAt, login, logout, canUploadThisWeek, recordUpload }}
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
