// frontend/src/pages/misc/HomePage.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function HomePage() {
  const { isAuthenticated, role, user } = useAuth();

  const isCliente = isAuthenticated && role === "CLIENTE";
  const isAdmin = isAuthenticated && role === "ADMIN";

  return (
    <main
      style={{
        minHeight: "calc(100vh - 56px)",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.3rem",
            marginBottom: "1rem",
          }}
        >
          Welcome to Project SGC Ultimate
        </h1>

        <p
          style={{
            color: "#9ca3af",
            marginBottom: "1.5rem",
            fontSize: "0.95rem",
          }}
        >
          A modern field management platform with online reservations, admin
          control panel and role-based access using Java, MongoDB and React.
        </p>

        {isAuthenticated && user ? (
          <>
            <p
              style={{
                marginBottom: "1.25rem",
                fontSize: "0.9rem",
                color: "#a5b4fc",
              }}
            >
              Logged in as <strong>{user.nombreCompleto}</strong> (
              {role}).
            </p>

            {isCliente && (
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <Link
                  to="/cliente"
                  style={primaryBtn}
                >
                  Go to fields
                </Link>
                <Link
                  to="/cliente/reservas"
                  style={secondaryBtn}
                >
                  My reservations
                </Link>
              </div>
            )}

            {isAdmin && (
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <Link
                  to="/admin"
                  style={primaryBtn}
                >
                  Go to admin panel
                </Link>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <Link to="/login" style={secondaryBtn}>
              Login
            </Link>
            <Link to="/register" style={primaryBtn}>
              Create account
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

const primaryBtn = {
  padding: "0.6rem 1.4rem",
  borderRadius: "999px",
  border: "none",
  textDecoration: "none",
  background: "linear-gradient(to right, #22c55e, #0ea5e9, #6366f1)",
  color: "#020617",
  fontWeight: 600,
  fontSize: "0.9rem",
};

const secondaryBtn = {
  padding: "0.6rem 1.4rem",
  borderRadius: "999px",
  border: "1px solid #4b5563",
  textDecoration: "none",
  backgroundColor: "transparent",
  color: "#e5e7eb",
  fontSize: "0.9rem",
};
