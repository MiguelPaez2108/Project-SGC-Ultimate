import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../hooks/useAuth.js";

function addMinutesToTime(timeStr, minutesToAdd) {
  // timeStr: "HH:MM"
  let [h, m] = timeStr.split(":").map(Number);
  let total = h * 60 + m + minutesToAdd;

  // No contemplamos cruzar de día, no tiene sentido para reservas de canchas
  let newH = Math.floor(total / 60);
  let newM = total % 60;

  const hh = String(newH).padStart(2, "0");
  const mm = String(newM).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function CanchaDetalle() {
  const { canchaId } = useParams();
  const { userId } = useAuth();

  const [cancha, setCancha] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // estado para la reserva
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [durationHours, setDurationHours] = useState("1"); // 1h por defecto
  const [reserving, setReserving] = useState(false);
  const [reserveError, setReserveError] = useState(null);
  const [reserveSuccess, setReserveSuccess] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const canchaRes = await axiosClient.get(`/api/canchas/${canchaId}`);
        const horariosRes = await axiosClient.get(
          `/api/horarios/por-cancha/${canchaId}`
        );

        setCancha(canchaRes.data);
        setHorarios(horariosRes.data);
      } catch (err) {
        console.error("Error loading cancha details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [canchaId]);

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    setReserveError(null);
    setReserveSuccess(null);

    if (!selectedDate || !startTime) {
      setReserveError("Please select a date and a start time.");
      return;
    }

    if (!userId) {
      setReserveError("User not identified. Please log in again.");
      return;
    }

    try {
      setReserving(true);

      // duración en minutos
      const minutes = Number(durationHours) * 60;
      const endTime = addMinutesToTime(startTime, minutes);

      const fechaInicio = `${selectedDate}T${startTime}:00`;
      const fechaFin = `${selectedDate}T${endTime}:00`;

      const payload = {
        canchaId,
        usuarioId: userId,
        fechaInicio,
        fechaFin,
      };

      console.log("Creating reservation with payload:", payload);

      const res = await axiosClient.post("/api/reservas", payload);
      const reserva = res.data;

      setReserveSuccess(
        `Reservation created successfully. Total price: $${reserva.precioTotal}`
      );
    } catch (err) {
      console.error("Error creating reservation:", err);

      if (err.response) {
        const { status, data } = err.response;
        if (data?.message) {
          setReserveError(data.message);
        } else if (status === 409) {
          setReserveError("Field already reserved at that time.");
        } else if (status === 400) {
          setReserveError(
            "Invalid reservation data. Check date, time and duration."
          );
        } else {
          setReserveError(
            `Server error (${status}). Please try again or contact support.`
          );
        }
      } else if (err.request) {
        setReserveError("Cannot reach the server. Is the backend running?");
      } else {
        setReserveError("Unexpected error while creating the reservation.");
      }
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <p>Loading field info...</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{cancha?.nombre}</h1>
      <p>Type: {cancha?.tipo}</p>
      <p>Price per hour: ${cancha?.precioPorHora}</p>

      <h2 style={{ marginTop: "2rem" }}>Available schedules:</h2>

      {horarios.length === 0 && <p>No schedules available.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {horarios.map((h) => (
          <li
            key={h.id}
            style={{
              padding: "1rem",
              marginBottom: "0.5rem",
              borderRadius: "0.5rem",
              background: "#020617",
            }}
          >
            <strong>{h.diaSemana}</strong>: {h.horaInicio} - {h.horaFin}
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: "2rem" }}>Create a reservation</h2>

      <form
        onSubmit={handleCreateReservation}
        style={{ maxWidth: "400px", marginTop: "1rem" }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label>Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Start time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Duration (hours)</label>
          <select
            value={durationHours}
            onChange={(e) => setDurationHours(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="1">1 hour</option>
            <option value="1.5">1.5 hours</option>
            <option value="2">2 hours</option>
          </select>
        </div>

        {reserveError && (
          <p style={{ color: "red", marginBottom: "0.75rem" }}>
            {reserveError}
          </p>
        )}
        {reserveSuccess && (
          <p style={{ color: "lightgreen", marginBottom: "0.75rem" }}>
            {reserveSuccess}
          </p>
        )}

        <button type="submit" disabled={reserving}>
          {reserving ? "Creating reservation..." : "Reserve"}
        </button>
      </form>
    </main>
  );
}
