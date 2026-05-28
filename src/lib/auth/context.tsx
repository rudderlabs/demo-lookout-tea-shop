'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  userId: string;
}

export function generateUserId(email: string): string {
  return btoa(email).replace(/[=+/]/g, '');
}

const STORAGE_KEY = 'tea-leafs-auth';

interface AuthContextValue {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (profile: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UserProfile) : null;
  });

  const login = useCallback((profile: UserProfile): void => {
    setUser(profile);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, []);

  const logout = useCallback((): void => {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, isLoggedIn: user !== null, login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
