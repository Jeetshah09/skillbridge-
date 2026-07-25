"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, authAPI, tokenManager } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerStudent: (data: any) => Promise<void>;
  registerHR: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    const existingToken = tokenManager.getToken();
    const existingUser = tokenManager.getUser();
    
    if (existingToken && existingUser) {
      setToken(existingToken);
      setUser(existingUser);
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      const userData: User = {
        email,
        first_name: response.first_name,
        last_name: response.last_name,
        role: response.role as 'student' | 'hr' | 'admin',
      };

      tokenManager.setToken(response.access_token);
      tokenManager.setUser(userData);
      
      setToken(response.access_token);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const registerStudent = async (data: any) => {
    try {
      await authAPI.registerStudent(data);
      // Auto-login after successful registration
      await login(data.email, data.password);
    } catch (error) {
      throw error;
    }
  };

  const registerHR = async (data: any) => {
    try {
      await authAPI.registerHR(data);
      // Auto-login after successful registration
      await login(data.email, data.password);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    tokenManager.logout();
    setUser(null);
    setToken(null);
    
    // Force redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    registerStudent,
    registerHR,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
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
