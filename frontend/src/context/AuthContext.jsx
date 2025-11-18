import { createContext, useEffect, useState } from "react";
import { loginApi, registerApi } from "../api/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // ADMIN | CLIENTE
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar auth desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken && storedRole && storedUserId) {
      setToken(storedToken);
      setRole(storedRole);
      setUserId(storedUserId);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    // data: { token, usuarioId, rol }
    setToken(data.token);
    setRole(data.rol);
    setUserId(data.usuarioId);

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.rol);
    localStorage.setItem("userId", data.usuarioId);

    return data;
  };

  const register = async (payload) => {
    // payload: { nombreCompleto, email, password, telefono }
    const user = await registerApi(payload);
    return user;
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  };

  const value = {
    token,
    role,
    userId,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
