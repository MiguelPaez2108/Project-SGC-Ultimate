// frontend/src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("miguel.paez@test.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await axiosClient.post("/api/auth/login", {
        email,
        password,
      });

      const { token, rol, usuarioId } = res.data;

      // Guardar en contexto + localStorage
      login(token, rol, usuarioId);

      // Redirigir según rol
      if (rol === "ADMIN") {
        navigate("/admin");
      } else if (rol === "CLIENTE") {
        navigate("/cliente");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        // El backend respondió con error (4xx/5xx)
        if (err.response.status === 400 || err.response.status === 401) {
          setError("Invalid email or password.");
        } else {
          console.error("Backend error data:", err.response.data);
          setError(
            `Unexpected error (${err.response.status}). Try again later.`
          );
        }
      } else {
        // Error de red / CORS / backend caído
        setError("Network error. Check if backend (port 8080) is running.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "4rem",
        backgroundColor: "#020617",
        color: "#f9fafb",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#020617",
          padding: "2rem",
          borderRadius: "0.75rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Login</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                border: "1px solid #4b5563",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                border: "1px solid #4b5563",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#f97373", marginBottom: "0.75rem" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "0.5rem 1.5rem",
              borderRadius: "999px",
              border: "none",
              backgroundColor: submitting ? "#16a34a88" : "#16a34a",
              color: "#0b1120",
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "1rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#38bdf8" }}>
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}

