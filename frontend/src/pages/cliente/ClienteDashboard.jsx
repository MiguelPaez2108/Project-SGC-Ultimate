import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getCanchas } from "../../api/canchasApi.js";

export default function ClienteDashboard() {
  const { userId, role } = useAuth();
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCanchas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCanchas();
        setCanchas(data);
      } catch (err) {
        console.error("Error loading fields:", err);
        setError("Could not load fields. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCanchas();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Client Dashboard</h1>
      <p>Role: {role}</p>
      <p>User ID: {userId}</p>

      <p style={{ marginTop: "1rem" }}>
        <Link to="/cliente/reservas">Go to my reservations</Link>
      </p>

      <h2 style={{ marginTop: "2rem" }}>Available fields</h2>

      {loading && <p>Loading fields...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && canchas.length === 0 && (
        <p>No fields available at the moment.</p>
      )}

      {!loading && !error && canchas.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
          {canchas.map((cancha) => (
            <li
              key={cancha.id}
              style={{
                padding: "1rem",
                marginBottom: "0.75rem",
                borderRadius: "0.5rem",
                backgroundColor: "#020617",
                border: "1px solid #1f2937",
              }}
            >
              <h3 style={{ margin: 0 }}>
                <Link
                  to={`/cliente/cancha/${cancha.id}`}
                  style={{ color: "#38bdf8", textDecoration: "none" }}
                >
                  {cancha.nombre}
                </Link>
              </h3>
              <p style={{ margin: "0.25rem 0" }}>
                Type: {cancha.tipo} · Price per hour:{" "}
                <strong>${cancha.precioPorHora}</strong>
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                Status: {cancha.estado}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
