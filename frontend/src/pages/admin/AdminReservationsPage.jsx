import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient.js";

const ESTADOS = ["PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"];

export default function AdminReservationsPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/reservas");
      setReservas(res.data);
    } catch (err) {
      console.error("Error loading reservations:", err);
      setError("Could not load reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservas();
  }, []);

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      setUpdatingId(id);
      setError(null);
      await axiosClient.put(`/api/reservas/${id}/estado`, null, {
        params: { estado: nuevoEstado },
      });
      await loadReservas();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Error updating reservation status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>All reservations</h1>

      {loading && <p>Loading reservations...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && reservas.length === 0 && (
        <p>No reservations found.</p>
      )}

      {!loading && !error && reservas.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                Field
              </th>
              <th style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                Client
              </th>
              <th style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                Start
              </th>
              <th style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                End
              </th>
              <th style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                Status
              </th>
              <th style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                Total
              </th>
              <th style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id}>
                <td style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                  {r.canchaNombre || r.canchaId}
                </td>
                <td style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                  {r.usuarioNombre || r.usuarioId}
                </td>
                <td style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                  {r.fechaInicio}
                </td>
                <td style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                  {r.fechaFin}
                </td>
                <td style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                  {r.estado}
                </td>
                <td style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                  ${r.precioTotal}
                </td>
                <td style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                  <select
                    value={r.estado}
                    onChange={(e) => handleChangeEstado(r.id, e.target.value)}
                    disabled={updatingId === r.id}
                  >
                    {ESTADOS.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
