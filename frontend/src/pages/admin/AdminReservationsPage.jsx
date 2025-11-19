// frontend/src/pages/admin/AdminReservationsPage.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const ESTADOS = [
  "ALL",
  "PENDIENTE",
  "CONFIRMADA",
  "COMPLETADA",
  "CANCELADA",
];

export default function AdminReservationsPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");

  async function loadReservas() {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/api/reservas");
      setReservas(res.data || []);
    } catch (err) {
      console.error("Error loading reservations:", err);
      setError("Error loading reservations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservas();
  }, []);

  async function updateEstado(id, nuevoEstado) {
    try {
      await axiosClient.put(`/api/reservas/${id}/estado`, null, {
        params: { estado: nuevoEstado },
      });
      await loadReservas();
    } catch (err) {
      console.error("Error updating reservation state:", err);
      setError("Error updating reservation.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this reservation?"))
      return;

    try {
      await axiosClient.delete(`/api/reservas/${id}`);
      await loadReservas();
    } catch (err) {
      console.error("Error deleting reservation:", err);
      setError("Error deleting reservation.");
    }
  }

  const filtered = reservas.filter((r) =>
    statusFilter === "ALL" ? true : r.estado === statusFilter
  );

  function formatDate(str) {
    if (!str) return "-";
    // viene como "2025-11-24T21:00"
    return str.replace("T", " ");
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
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        Manage Reservations
      </h1>

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <label
            htmlFor="status-filter"
            style={{ marginRight: "0.5rem", fontSize: "0.95rem" }}
          >
            Status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "0.35rem 0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid #4b5563",
              backgroundColor: "#020617",
              color: "#e5e7eb",
            }}
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={loadReservas}
          style={{
            padding: "0.35rem 0.9rem",
            borderRadius: "999px",
            border: "1px solid #4b5563",
            backgroundColor: "transparent",
            color: "#e5e7eb",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Refresh
        </button>
      </div>

      {error && (
        <p style={{ color: "#f97373", marginBottom: "0.75rem" }}>{error}</p>
      )}

      {loading ? (
        <p>Loading reservations...</p>
      ) : filtered.length === 0 ? (
        <p>No reservations found for this filter.</p>
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
                <th style={thStyle}>Client</th>
                <th style={thStyle}>Start</th>
                <th style={thStyle}>End</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  style={{
                    borderBottom: "1px solid #111827",
                    backgroundColor: "#020617",
                  }}
                >
                  <td style={tdStyle}>{r.canchaNombre}</td>
                  <td style={tdStyle}>{r.usuarioNombre}</td>
                  <td style={tdStyle}>{formatDate(r.fechaInicio)}</td>
                  <td style={tdStyle}>{formatDate(r.fechaFin)}</td>
                  <td style={tdStyle}>${r.precioTotal}</td>
                  <td style={tdStyle}>{r.estado}</td>
                  <td style={tdStyle}>
                    {r.estado !== "CONFIRMADA" && r.estado !== "COMPLETADA" && (
                      <button
                        onClick={() => updateEstado(r.id, "CONFIRMADA")}
                        style={btnSmall("primary")}
                      >
                        Confirm
                      </button>
                    )}
                    {r.estado !== "COMPLETADA" && r.estado !== "CANCELADA" && (
                      <button
                        onClick={() => updateEstado(r.id, "COMPLETADA")}
                        style={btnSmall("success")}
                      >
                        Complete
                      </button>
                    )}
                    {r.estado !== "CANCELADA" && (
                      <button
                        onClick={() => updateEstado(r.id, "CANCELADA")}
                        style={btnSmall("danger")}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(r.id)}
                      style={btnSmall("ghost")}
                    >
                      Delete
                    </button>
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

function btnSmall(variant) {
  let base = {
    padding: "0.25rem 0.6rem",
    borderRadius: "999px",
    border: "none",
    fontSize: "0.8rem",
    cursor: "pointer",
    marginRight: "0.35rem",
  };

  switch (variant) {
    case "primary":
      return {
        ...base,
        backgroundColor: "#1d4ed8",
        color: "#e5e7eb",
      };
    case "success":
      return {
        ...base,
        backgroundColor: "#16a34a",
        color: "#0b1120",
      };
    case "danger":
      return {
        ...base,
        backgroundColor: "#dc2626",
        color: "#f9fafb",
      };
    case "ghost":
    default:
      return {
        ...base,
        backgroundColor: "transparent",
        border: "1px solid #4b5563",
        color: "#e5e7eb",
      };
  }
}
