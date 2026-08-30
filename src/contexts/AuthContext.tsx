"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/api";

interface User {
  username: string;
  email: string;
  role: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = (accessToken: string, nextUser: User) => {
    setToken(accessToken);
    setUser(nextUser);
    localStorage.setItem("auth_token", accessToken);
  };

  // Load persisted token and user profile on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("auth_token");
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await authService.getProfile(savedToken);
        setToken(savedToken);
        setUser({
          username: profile.username,
          email: profile.email,
          role: profile.role,
          created_at: profile.created_at,
        });
      } catch {
        localStorage.removeItem("auth_token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await authService.signup(username, email, password);
      persistSession(response.access_token, response.user);
    } catch (error: any) {
      throw new Error(error.message || "Signup failed");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      persistSession(response.access_token, response.user);
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
