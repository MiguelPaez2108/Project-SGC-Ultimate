// frontend/src/hooks/useAuth.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("authRole");
    const storedUserId = localStorage.getItem("authUserId");

    if (storedToken && storedRole && storedUserId) {
      setToken(storedToken);
      setRole(storedRole);
      setUserId(storedUserId);
    }
    setLoading(false);
  }, []);

  const login = (token, role, userId) => {
    setToken(token);
    setRole(role);
    setUserId(userId);

    localStorage.setItem("authToken", token);
    localStorage.setItem("authRole", role);
    localStorage.setItem("authUserId", userId);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authUserId");
  };

  const value = {
    token,
    role,
    userId,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
