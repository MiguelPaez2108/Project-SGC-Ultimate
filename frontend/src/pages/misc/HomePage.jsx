import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function HomePage() {
  const { isAuthenticated, role } = useAuth();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Project SGC Ultimate</h1>
      <p>Full-stack football field management system.</p>

      {!isAuthenticated && (
        <p>
          <Link to="/login">Login</Link> or{" "}
          <Link to="/register">Create an account</Link>
        </p>
      )}

      {isAuthenticated && role === "CLIENTE" && (
        <p>
          Go to your <Link to="/cliente">client dashboard</Link>.
        </p>
      )}

      {isAuthenticated && role === "ADMIN" && (
        <p>
          Go to <Link to="/admin">admin dashboard</Link>.
        </p>
      )}
    </main>
  );
}
