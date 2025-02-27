'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface User {
  id: number;
  username: string;
  email: string;
  token: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      const userData = {
        ...data.user,
        token: data.token,
        refreshToken: data.refresh_token,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      Cookies.set('token', data.token);
      toast.success('Logged in successfully');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to login');
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Registration successful');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    }
  };

  const refreshToken = async (): Promise<string> => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('No refresh token available');
      }

      const { refreshToken } = JSON.parse(storedUser);
      const response = await fetch('http://localhost:5000/api/auth/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh token');
      }

      // Update stored user data with new token
      const userData = JSON.parse(storedUser);
      userData.token = data.token;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return data.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  const getToken = async (): Promise<string | null> => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return null;

      const userData = JSON.parse(storedUser);

      // Try to use the existing token first
      try {
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });

        if (response.ok) {
          return userData.token;
        }
      } catch (error) {
        console.log('Token verification failed, attempting refresh');
      }

      // If verification fails, try to refresh
      return await refreshToken();
    } catch (error) {
      console.error('Failed to get valid token:', error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    Cookies.remove('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
