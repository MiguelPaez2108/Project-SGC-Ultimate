import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient.js";

const DIAS = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO",
];

export default function AdminHorariosPage() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    canchaId: "",
    diaSemana: "LUNES",
    horaInicio: "18:00",
    horaFin: "20:00",
  });
  const [saving, setSaving] = useState(false);

  const loadHorarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/horarios");
      setHorarios(res.data);
    } catch (err) {
      console.error("Error loading schedules:", err);
      setError("Could not load schedules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHorarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        canchaId: form.canchaId,
        diaSemana: form.diaSemana,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
      };
      await axiosClient.post("/api/horarios", payload);
      await loadHorarios();
    } catch (err) {
      console.error("Error creating schedule:", err);
      setError("Error creating schedule.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this schedule?");
    if (!ok) return;
    try {
      await axiosClient.delete(`/api/horarios/${id}`);
      await loadHorarios();
    } catch (err) {
      console.error("Error deleting schedule:", err);
      setError("Error deleting schedule.");
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Schedules management</h1>

      <section style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
        <h2>Create new schedule</h2>
        <form
          onSubmit={handleCreate}
          style={{ maxWidth: "400px", marginTop: "1rem" }}
        >
          <div style={{ marginBottom: "0.75rem" }}>
            <label>Field ID</label>
            <input
              type="text"
              name="canchaId"
              value={form.canchaId}
              onChange={handleChange}
              style={{ width: "100%" }}
              required
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label>Day of week</label>
            <select
              name="diaSemana"
              value={form.diaSemana}
              onChange={handleChange}
              style={{ width: "100%" }}
            >
              {DIAS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label>Start time</label>
            <input
              type="time"
              name="horaInicio"
              value={form.horaInicio}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label>End time</label>
            <input
              type="time"
              name="horaFin"
              value={form.horaFin}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>

          {error && (
            <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>
          )}

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Create schedule"}
          </button>
        </form>
      </section>

      <section>
        <h2>Existing schedules</h2>

        {loading && <p>Loading schedules...</p>}
        {!loading && horarios.length === 0 && <p>No schedules found.</p>}

        {!loading && horarios.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
            {horarios.map((h) => (
              <li
                key={h.id}
                style={{
                  padding: "1rem",
                  marginBottom: "0.75rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#020617",
                  border: "1px solid #1f2937",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <strong>Field:</strong> {h.canchaId} ·{" "}
                  <strong>{h.diaSemana}</strong> · {h.horaInicio} - {h.horaFin} ·{" "}
                  {h.activo ? "ACTIVE" : "INACTIVE"}
                </div>
                <button onClick={() => handleDelete(h.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
