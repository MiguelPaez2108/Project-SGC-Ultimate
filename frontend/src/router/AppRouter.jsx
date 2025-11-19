import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


// Pages públicas
import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import HomePage from "../pages/misc/HomePage.jsx";
import NotFoundPage from "../pages/misc/NotFoundPage.jsx";

// Cliente
import ClienteDashboard from "../pages/cliente/ClienteDashboard.jsx";
import CanchaDetalle from "../pages/cliente/CanchaDetalle.jsx";
import MisReservasPage from "../pages/cliente/MisReservasPage.jsx";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminFieldsPage from "../pages/admin/AdminFieldsPage.jsx";
import AdminReservationsPage from "../pages/admin/AdminReservationsPage.jsx";
import AdminHorariosPage from "../pages/admin/AdminHorariosPage.jsx";
import AdminUsersPage from "../pages/admin/AdminUsersPage.jsx";

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
      <Route
        path="/admin/canchas"
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <AdminFieldsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/reservas"
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <AdminReservationsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/horarios"
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <AdminHorariosPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <AdminUsersPage />
          </RequireAuth>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

