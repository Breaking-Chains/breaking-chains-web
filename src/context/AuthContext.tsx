import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthTokens } from '../types/user';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';
import { apiFetch } from '../services/apiClient';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoSession: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, username: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'demo-user-1',
  email: 'guest.recovering@example.com',
  fullName: 'Guest Recoverer',
  username: 'pmo_warrior',
  authProvider: 'LOCAL',
  createdAt: '2026-07-14T00:00:00Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoSession, setIsDemoSession] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch {
          // Token expired or server unreachable
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authTokens = await loginUser(email, password);
      setTokens(authTokens);
      setUser(authTokens.user);
      setIsDemoSession(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string, username: string) => {
    setIsLoading(true);
    try {
      const authTokens = await registerUser(email, password, fullName, username);
      setTokens(authTokens);
      setUser(authTokens.user);
      setIsDemoSession(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = () => {
    setUser(DEMO_USER);
    setIsDemoSession(true);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (!isDemoSession) {
        await apiFetch('/api/v1/auth/logout', { method: 'POST' }).catch(() => {});
      }
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setTokens(null);
      setIsDemoSession(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!user,
        isLoading,
        isDemoSession,
        login,
        register,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
