'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  avatar: string;
  tokens: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
  addTokens: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  name: 'Alex Turing',
  email: 'user@reasonverse.com',
  avatar: '/avatar.png',
  tokens: 100,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = useCallback(
    (email: string) => {
      // In a real app, you'd verify credentials
      if (email) {
        setUser({ ...mockUser });
        router.push('/');
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    setUser(null);
    router.push('/login');
  }, [router]);

  const addTokens = useCallback((amount: number) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      return { ...currentUser, tokens: currentUser.tokens + amount };
    });
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    addTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
