import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import type { AuthResponse, LoginPayload, SignUpPayload } from "../types/auth";

type AuthContextType = {
  user: AuthResponse["user"] | null;
  token: string | null;
  loading: boolean;
  signup: (payload: SignUpPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axiosClient.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const persistAuth = (auth: AuthResponse) => {
    if (auth.token) {
      localStorage.setItem("token", auth.token);
      setToken(auth.token);
    }
    if (auth.user) {
      localStorage.setItem("user", JSON.stringify(auth.user));
      setUser(auth.user);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const signup = async (payload: SignUpPayload) => {
    setLoading(true);
    try {
      const res = await axiosClient.post<AuthResponse>("/signup", payload);
      persistAuth(res.data);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const res = await axiosClient.post<AuthResponse>("/login", payload);
      persistAuth(res.data);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
