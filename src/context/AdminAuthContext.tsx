"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const SESSION_KEY = "dtx_admin_session";

interface AdminUser {
  name: string;
  email: string;
  role: "superadmin";
}

interface AdminAuthContextValue {
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved === "true") {
      setAdminUser({ name: "Prasad Belhekar", email: "admin@thedogthingx.com", role: "superadmin" });
    }
  }, []);

  function adminLogin(pin: string): boolean {
    const currentPin = typeof window !== "undefined" ? (localStorage.getItem("dtx_admin_pin") || "2024") : "2024";
    if (pin === currentPin) {
      const user: AdminUser = { name: "Prasad Belhekar", email: "admin@thedogthingx.com", role: "superadmin" };
      setAdminUser(user);
      localStorage.setItem(SESSION_KEY, "true");
      return true;
    }
    return false;
  }

  function adminLogout() {
    setAdminUser(null);
    localStorage.removeItem(SESSION_KEY);
  }

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn: !!adminUser, adminUser, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
