import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("miguel.paez@test.com"); // para probar rápido
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(email, password);

      console.log("Login OK, data from backend:", data);

      if (data.rol === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/cliente", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        const { status, data } = err.response;

        if (status === 401) {
          setError("Invalid email or password.");
        } else if (status === 400) {
          setError(
            data?.message || "Bad request. Please check the submitted data."
          );
        } else {
          setError(
            data?.message ||
              `Server error (${status}). Please try again or check the backend.`
          );
        }
      } else if (err.request) {
        setError("Cannot reach the server. Is the backend running on :8080?");
      } else {
        setError("Unexpected error while trying to login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
}
