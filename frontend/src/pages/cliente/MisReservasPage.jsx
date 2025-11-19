import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function MisReservasPage() {
  const { userId } = useAuth();

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/reservas");
      // Filtrar solo las del usuario logueado
      const mias = res.data.filter((r) => r.usuarioId === userId);
      setReservas(mias);
    } catch (err) {
      console.error("Error loading reservations:", err);
      setError("Could not load your reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleCancel = async (reservaId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirmCancel) return;

    try {
      setUpdatingId(reservaId);
      setError(null);

      await axiosClient.put(
        `/api/reservas/${reservaId}/estado?estado=CANCELADA`
      );

      // Recargar reservas
      await loadReservas();
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      setError("Error cancelling the reservation. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>My reservations</h1>

      {loading && <p>Loading reservations...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && reservas.length === 0 && (
        <p>You don&apos;t have any reservations yet.</p>
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
              <th style={{ borderBottom: "1px solid #1px2937", padding: "0.5rem" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id}>
                <td
                  style={{
                    borderBottom: "1px solid #1f2937",
                    padding: "0.5rem",
                  }}
                >
                  {r.canchaNombre || r.canchaId}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #1f2937",
                    padding: "0.5rem",
                  }}
                >
                  {r.fechaInicio}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #1f2937",
                    padding: "0.5rem",
                  }}
                >
                  {r.fechaFin}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #1f2937",
                    padding: "0.5rem",
                  }}
                >
                  {r.estado}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #1f2937",
                    padding: "0.5rem",
                  }}
                >
                  ${r.precioTotal}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #1f2937",
                    padding: "0.5rem",
                  }}
                >
                  {r.estado === "PENDIENTE" || r.estado === "CONFIRMADA" ? (
                    <button
                      onClick={() => handleCancel(r.id)}
                      disabled={updatingId === r.id}
                    >
                      {updatingId === r.id ? "Cancelling..." : "Cancel"}
                    </button>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
