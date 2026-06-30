"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  isGuest: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  signIn: (email: string, password?: string, name?: string) => void;
  signOut: () => void;
  resetPassword: (email: string, newPassword: string) => boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("dtx_user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
  }, []);

  const signIn = (email: string, password?: string, name?: string) => {
    const userName = name || email.split("@")[0];
    const user: User = { name: userName, email, isGuest: false };
    setCurrentUser(user);
    localStorage.setItem("dtx_user", JSON.stringify(user));

    try {
      const users: { email: string; name: string; password?: string }[] = JSON.parse(
        localStorage.getItem("dtx_users") || "[]"
      );
      if (!users.find((u) => u.email === email)) {
        users.push({ email, name: userName, password });
        localStorage.setItem("dtx_users", JSON.stringify(users));
      }
    } catch { /* no-op */ }
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("dtx_user");
  };

  const resetPassword = (email: string, newPassword: string): boolean => {
    try {
      const stored = localStorage.getItem("dtx_users");
      if (!stored) return false;
      const users: { email: string; password?: string }[] = JSON.parse(stored);
      const idx = users.findIndex((u) => u.email === email);
      if (idx === -1) return false;
      users[idx].password = newPassword;
      localStorage.setItem("dtx_users", JSON.stringify(users));
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signIn,
        signOut,
        resetPassword,
        isLoggedIn: !!currentUser && !currentUser.isGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
