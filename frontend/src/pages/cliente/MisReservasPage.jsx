// frontend/src/pages/cliente/MisReservasPage.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../hooks/useAuth.jsx";

const STATUS_LABELS = {
  PENDIENTE: "Pending",
  CONFIRMADA: "Confirmed",
  COMPLETADA: "Completed",
  CANCELADA: "Canceled",
};

export default function MisReservasPage() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const [error, setError] = useState("");

  async function loadReservas() {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/api/reservas/mis");
      setReservas(res.data || []);
    } catch (err) {
      console.error("Error loading my reservations:", err);
      setError("Error loading reservations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservas();
  }, []);

  function formatDate(str) {
    if (!str) return "-";
    return str.replace("T", " ");
  }

  async function handleCancel(id) {
    const reserva = reservas.find((r) => r.id === id);
    if (!reserva) return;

    if (
      reserva.estado === "COMPLETADA" ||
      reserva.estado === "CANCELADA"
    ) {
      alert("This reservation can no longer be canceled.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    setCancelingId(id);
    setError("");

    try {
      await axiosClient.put(`/api/reservas/${id}/estado`, null, {
        params: { estado: "CANCELADA" },
      });
      await loadReservas();
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      setError("Error cancelling reservation.");
    } finally {
      setCancelingId(null);
    }
  }

  return (
    <main
      style={{
        padding: "2rem",
        color: "#e5e7eb",
        minHeight: "100vh",
        backgroundColor: "#020617",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        My reservations
      </h1>

      {user && (
        <p style={{ marginBottom: "1.5rem", color: "#9ca3af" }}>
          Logged in as <strong>{user.nombreCompleto}</strong> ({user.email})
        </p>
      )}

      {error && (
        <p style={{ color: "#f97373", marginBottom: "0.75rem" }}>{error}</p>
      )}

      {loading ? (
        <p>Loading reservations...</p>
      ) : reservas.length === 0 ? (
        <p>You don't have any reservations yet.</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.95rem",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#020617",
                  borderBottom: "1px solid #1f2937",
                }}
              >
                <th style={thStyle}>Field</th>
                <th style={thStyle}>Start</th>
                <th style={thStyle}>End</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr
                  key={r.id}
                  style={{
                    borderBottom: "1px solid #111827",
                    backgroundColor: "#020617",
                  }}
                >
                  <td style={tdStyle}>{r.canchaNombre}</td>
                  <td style={tdStyle}>{formatDate(r.fechaInicio)}</td>
                  <td style={tdStyle}>{formatDate(r.fechaFin)}</td>
                  <td style={tdStyle}>${r.precioTotal}</td>
                  <td style={tdStyle}>
                    {STATUS_LABELS[r.estado] || r.estado}
                  </td>
                  <td style={tdStyle}>
                    {r.estado !== "COMPLETADA" &&
                      r.estado !== "CANCELADA" && (
                        <button
                          onClick={() => handleCancel(r.id)}
                          disabled={cancelingId === r.id}
                          style={{
                            padding: "0.25rem 0.7rem",
                            borderRadius: "999px",
                            border: "none",
                            fontSize: "0.8rem",
                            cursor: cancelingId === r.id ? "wait" : "pointer",
                            backgroundColor: "#dc2626",
                            color: "#f9fafb",
                          }}
                        >
                          {cancelingId === r.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "0.5rem 0.75rem",
  fontWeight: 600,
  fontSize: "0.9rem",
};

const tdStyle = {
  padding: "0.5rem 0.75rem",
  verticalAlign: "middle",
};
