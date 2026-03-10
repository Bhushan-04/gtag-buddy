import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, name?: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  const login = useCallback((email: string, password: string, name?: string) => {
    if (!email.trim()) return { success: false, error: "Email is required" };
    if (password.length < 6) return { success: false, error: "Password must be at least 6 characters" };
    const displayName = name || email.split("@")[0];
    setUser({ name: displayName, email: email.trim() });
    return { success: true };
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    if (!name.trim()) return { success: false, error: "Name is required" };
    if (!email.trim()) return { success: false, error: "Email is required" };
    if (password.length < 6) return { success: false, error: "Password must be at least 6 characters" };
    setUser({ name: name.trim(), email: email.trim() });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
