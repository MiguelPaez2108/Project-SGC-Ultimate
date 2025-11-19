// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, role, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        width: "100%",
        backgroundColor: "#020617",
        borderBottom: "1px solid #1f2937",
        padding: "0.75rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Logo / Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "999px",
            background:
              "radial-gradient(circle at 30% 20%, #22c55e, #0f172a 60%)",
          }}
        />
        <Link
          to="/"
          style={{
            color: "#e5e7eb",
            fontWeight: 700,
            fontSize: "1rem",
            textDecoration: "none",
            letterSpacing: "0.05em",
          }}
        >
          PROJECT SGC ULTIMATE
        </Link>
      </div>

      {/* Links de navegación */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Links comunes */}
        <Link style={linkStyle} to="/">
          Home
        </Link>

        {isAuthenticated && role === "CLIENTE" && (
          <>
            <Link style={linkStyle} to="/cliente">
              Fields
            </Link>
            <Link style={linkStyle} to="/cliente/reservas">
              My reservations
            </Link>
          </>
        )}

        {isAuthenticated && role === "ADMIN" && (
          <>
            <Link style={linkStyle} to="/admin">
              Admin
            </Link>
            <Link style={linkStyle} to="/admin/fields">
              Fields
            </Link>
            <Link style={linkStyle} to="/admin/horarios">
              Schedules
            </Link>
            <Link style={linkStyle} to="/admin/reservations">
              Reservations
            </Link>
            <Link style={linkStyle} to="/admin/users">
              Users
            </Link>
          </>
        )}
      </div>

      {/* Sección derecha (user info + login/logout) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {isAuthenticated && user ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                fontSize: "0.8rem",
              }}
            >
              <span style={{ color: "#e5e7eb", fontWeight: 500 }}>
                {user.nombreCompleto}
              </span>
              <span style={{ color: "#9ca3af" }}>{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.35rem 0.9rem",
                borderRadius: "999px",
                border: "1px solid #f97316",
                backgroundColor: "transparent",
                color: "#f97316",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                ...smallButton,
                border: "1px solid #4b5563",
                backgroundColor: "transparent",
                color: "#e5e7eb",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                ...smallButton,
                border: "none",
                background:
                  "linear-gradient(to right, #22c55e, #0ea5e9, #6366f1)",
                color: "#020617",
                fontWeight: 600,
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "#9ca3af",
  textDecoration: "none",
  fontSize: "0.9rem",
};

const smallButton = {
  padding: "0.35rem 0.9rem",
  borderRadius: "999px",
  fontSize: "0.8rem",
  textDecoration: "none",
};
