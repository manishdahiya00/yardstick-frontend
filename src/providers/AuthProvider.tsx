import React, { createContext, useContext, useState, useEffect } from "react";
import { axiosInstance } from "@/api/axios";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);
  const login = async (credentials: { email: string; password: string }) => {
    await axiosInstance.post("/auth/login", credentials, {
      withCredentials: true,
    });
    const res = await axiosInstance.get("/auth/me");
    setUser(res.data.user);
  };

  const logout = async () => {
    await axiosInstance.delete("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
