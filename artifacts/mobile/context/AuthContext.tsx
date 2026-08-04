import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  username: string;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = '@nashe_auth_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (val) {
          const data = JSON.parse(val) as { username: string };
          setIsLoggedIn(true);
          setUsername(data.username ?? '');
        }
      })
      .catch(() => {
        // ignore
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (user: string, password: string): Promise<boolean> => {
    if (!user.trim() || !password.trim()) return false;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ username: user.trim() }));
    setUsername(user.trim());
    setIsLoggedIn(true);
    return true;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
