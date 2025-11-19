import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

// Pages
import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import ClienteDashboard from "../pages/cliente/ClienteDashboard.jsx";
import CanchaDetalle from "../pages/cliente/CanchaDetalle.jsx";
import MisReservasPage from "../pages/cliente/MisReservasPage.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import HomePage from "../pages/misc/HomePage.jsx";
import NotFoundPage from "../pages/misc/NotFoundPage.jsx";

function RequireAuth({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "ADMIN") return <Navigate to="/admin" replace />;
    if (role === "CLIENTE") return <Navigate to="/cliente" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Cliente */}
      <Route
        path="/cliente"
        element={
          <RequireAuth allowedRoles={["CLIENTE"]}>
            <ClienteDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/cliente/cancha/:canchaId"
        element={
          <RequireAuth allowedRoles={["CLIENTE"]}>
            <CanchaDetalle />
          </RequireAuth>
        }
      />
      <Route
        path="/cliente/reservas"
        element={
          <RequireAuth allowedRoles={["CLIENTE"]}>
            <MisReservasPage />
          </RequireAuth>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </RequireAuth>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
