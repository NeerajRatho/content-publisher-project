import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const loc = useLocation();

  if (auth.loading) return <div className="center">Checking auth...</div>;

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  return <>{children}</>;
};
