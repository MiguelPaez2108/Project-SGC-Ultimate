import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";



export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header
      style={{
        padding: "0.75rem 2rem",
        borderBottom: "1px solid #111827",
        backgroundColor: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Link
          to="/"
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            textDecoration: "none",
          }}
        >
          PROJECT SGC ULTIMATE
        </Link>
      </div>

      <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {!isAuthenticated && (
          <>
            <Link to="/login" style={{ color: "#e5e7eb", textDecoration: "none" }}>
              Login
            </Link>
            <Link
              to="/register"
              style={{ color: "#38bdf8", textDecoration: "none" }}
            >
              Register
            </Link>
          </>
        )}

        {isAuthenticated && role === "CLIENTE" && (
          <>
            <Link
              to="/cliente"
              style={{ color: "#e5e7eb", textDecoration: "none" }}
            >
              Fields
            </Link>
            <Link
              to="/cliente/reservas"
              style={{ color: "#e5e7eb", textDecoration: "none" }}
            >
              My reservations
            </Link>
          </>
        )}

        {isAuthenticated && role === "ADMIN" && (
          <>
            <Link
              to="/admin"
              style={{ color: "#e5e7eb", textDecoration: "none" }}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/canchas"
              style={{ color: "#e5e7eb", textDecoration: "none" }}
            >
              Fields
            </Link>
            <Link
              to="/admin/reservas"
              style={{ color: "#e5e7eb", textDecoration: "none" }}
            >
              Reservations
            </Link>
            <Link
              to="/admin/horarios"
              style={{ color: "#e5e7eb", textDecoration: "none" }}
            >
              Schedules
            </Link>
            <Link
              to="/admin/usuarios"
              style={{ color: "#e5e7eb", textDecoration: "none" }}
            >
              Users
            </Link>
          </>
        )}

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            style={{
              marginLeft: "1rem",
              padding: "0.35rem 0.8rem",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#ef4444",
              color: "white",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
