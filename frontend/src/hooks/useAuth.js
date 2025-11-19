import { useContext, createContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("sgc_auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      setToken(parsed.token);
      setRole(parsed.rol);
      setUserId(parsed.usuarioId);
      axiosClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${parsed.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post("/api/auth/login", { email, password });
    const data = res.data;

    setToken(data.token);
    setRole(data.rol);
    setUserId(data.usuarioId);

    localStorage.setItem("sgc_auth", JSON.stringify(data));

    axiosClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.token}`;

    return data;
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    localStorage.removeItem("sgc_auth");
    delete axiosClient.defaults.headers.common["Authorization"];
  };

  const value = {
    token,
    role,
    userId,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
