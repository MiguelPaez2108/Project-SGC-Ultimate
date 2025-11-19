// frontend/src/pages/admin/AdminHorariosPage.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const DIAS_SEMANA = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO",
];

export default function AdminHorariosPage() {
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // formulario
  const [editingId, setEditingId] = useState(null);
  const [diaSemana, setDiaSemana] = useState("LUNES");
  const [horaInicio, setHoraInicio] = useState("18:00");
  const [horaFin, setHoraFin] = useState("20:00");
  const [activo, setActivo] = useState(true);

  // ========== Helpers ==========

  function resetForm() {
    setEditingId(null);
    setDiaSemana("LUNES");
    setHoraInicio("18:00");
    setHoraFin("20:00");
    setActivo(true);
    setError("");
  }

  async function loadFields() {
    setLoadingFields(true);
    setError("");

    try {
      const res = await axiosClient.get("/api/canchas");
      setFields(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedFieldId(res.data[0].id);
      }
    } catch (err) {
      console.error("Error loading fields:", err);
      setError("Error loading fields.");
    } finally {
      setLoadingFields(false);
    }
  }

  async function loadSchedules(fieldId) {
    if (!fieldId) return;
    setLoadingSchedules(true);
    setError("");

    try {
      const res = await axiosClient.get(`/api/horarios/por-cancha/${fieldId}`);
      setSchedules(res.data || []);
    } catch (err) {
      console.error("Error loading schedules:", err);
      setError("Error loading schedules.");
    } finally {
      setLoadingSchedules(false);
    }
  }

  function toMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  }

  function hasOverlap(existing, newStart, newEnd, dia) {
    const ns = toMinutes(newStart);
    const ne = toMinutes(newEnd);

    return existing.some((h) => {
      if (!h.activo) return false;
      if (h.diaSemana !== dia) return false;

      const es = toMinutes(h.horaInicio);
      const ee = toMinutes(h.horaFin);

      // solapan si empieza antes de que termine y termina después de que empieza
      return ns < ee && ne > es;
    });
  }

  // ========== Effects ==========

  useEffect(() => {
    loadFields();
  }, []);

  useEffect(() => {
    if (selectedFieldId) {
      loadSchedules(selectedFieldId);
      resetForm();
    }
  }, [selectedFieldId]);

  // ========== Handlers ==========

  function handleEditClick(h) {
    setEditingId(h.id);
    setDiaSemana(h.diaSemana || "LUNES");
    setHoraInicio(h.horaInicio || "18:00");
    setHoraFin(h.horaFin || "20:00");
    setActivo(Boolean(h.activo));
    setError("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this schedule?"))
      return;

    try {
      await axiosClient.delete(`/api/horarios/${id}`);
      await loadSchedules(selectedFieldId);
    } catch (err) {
      console.error("Error deleting schedule:", err);
      setError("Error deleting schedule.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!selectedFieldId) {
      setError("You must select a field.");
      setSaving(false);
      return;
    }

    if (!horaInicio || !horaFin) {
      setError("Start and end time are required.");
      setSaving(false);
      return;
    }

    if (toMinutes(horaFin) <= toMinutes(horaInicio)) {
      setError("End time must be greater than start time.");
      setSaving(false);
      return;
    }

    // Validación de solapamiento simple
    const otherSchedules = schedules.filter((h) =>
      editingId ? h.id !== editingId : true
    );

    if (hasOverlap(otherSchedules, horaInicio, horaFin, diaSemana)) {
      setError("This schedule overlaps with an existing one for that day.");
      setSaving(false);
      return;
    }

    const payload = {
      canchaId: selectedFieldId,
      diaSemana,
      horaInicio,
      horaFin,
    };

    try {
      if (editingId) {
        await axiosClient.put(`/api/horarios/${editingId}`, payload);
      } else {
        await axiosClient.post("/api/horarios", payload);
      }

      await loadSchedules(selectedFieldId);
      resetForm();
    } catch (err) {
      console.error("Error saving schedule:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Error: ${err.response.data.message}`);
      } else {
        setError("Unexpected error while saving schedule.");
      }
    } finally {
      setSaving(false);
    }
  }

  // ========== Render ==========

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
        Manage Schedules
      </h1>

      {/* selector de cancha */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="field-select"
          style={{ display: "block", marginBottom: "0.25rem" }}
        >
          Field
        </label>
        {loadingFields ? (
          <p>Loading fields...</p>
        ) : fields.length === 0 ? (
          <p>No fields available. Create one first.</p>
        ) : (
          <select
            id="field-select"
            value={selectedFieldId}
            onChange={(e) => setSelectedFieldId(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "320px",
              padding: "0.45rem 0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid #4b5563",
              backgroundColor: "#020617",
              color: "#e5e7eb",
            }}
          >
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
              </option>
            ))}
          </select>
        )}
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.2fr)",
          gap: "2rem",
          alignItems: "flex-start",
        }}
      >
        {/* Tabla de horarios */}
        <div>
          <h2 style={{ marginBottom: "0.75rem" }}>Schedules for field</h2>

          {loadingSchedules ? (
            <p>Loading schedules...</p>
          ) : schedules.length === 0 ? (
            <p>No schedules for this field yet.</p>
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
                    <th style={thStyle}>Day</th>
                    <th style={thStyle}>Start</th>
                    <th style={thStyle}>End</th>
                    <th style={thStyle}>Active</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((h) => (
                    <tr
                      key={h.id}
                      style={{
                        borderBottom: "1px solid #111827",
                        backgroundColor: h.activo ? "#020617" : "#111827",
                      }}
                    >
                      <td style={tdStyle}>{h.diaSemana}</td>
                      <td style={tdStyle}>{h.horaInicio}</td>
                      <td style={tdStyle}>{h.horaFin}</td>
                      <td style={tdStyle}>{h.activo ? "Yes" : "No"}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleEditClick(h)}
                          style={btnSmall("secondary")}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(h.id)}
                          style={btnSmall("danger")}
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
        </div>

        {/* Formulario */}
        <div
          style={{
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            padding: "1.5rem",
            backgroundColor: "#020617",
          }}
        >
          <h2 style={{ marginBottom: "0.75rem" }}>
            {editingId ? "Edit schedule" : "Create schedule"}
          </h2>

          {error && (
            <p style={{ color: "#f97373", marginBottom: "0.75rem" }}>{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{ display: "block", marginBottom: "0.25rem" }}
                htmlFor="dia"
              >
                Day
              </label>
              <select
                id="dia"
                value={diaSemana}
                onChange={(e) => setDiaSemana(e.target.value)}
                style={inputStyle}
              >
                {DIAS_SEMANA.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{ display: "block", marginBottom: "0.25rem" }}
                htmlFor="inicio"
              >
                Start time
              </label>
              <input
                id="inicio"
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{ display: "block", marginBottom: "0.25rem" }}
                htmlFor="fin"
              >
                End time
              </label>
              <input
                id="fin"
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  style={{ marginRight: "0.5rem" }}
                  disabled
                />
                Active (for now this flag is always true when saving)
              </label>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "0.45rem 1.25rem",
                  borderRadius: "999px",
                  border: "none",
                  backgroundColor: saving ? "#16a34a88" : "#16a34a",
                  color: "#0b1120",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving
                  ? editingId
                    ? "Saving..."
                    : "Creating..."
                  : editingId
                  ? "Save changes"
                  : "Create schedule"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "0.45rem 1.1rem",
                    borderRadius: "999px",
                    border: "1px solid #4b5563",
                    backgroundColor: "transparent",
                    color: "#e5e7eb",
                    cursor: "pointer",
                  }}
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
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

const inputStyle = {
  width: "100%",
  padding: "0.45rem 0.75rem",
  borderRadius: "0.375rem",
  border: "1px solid #4b5563",
  backgroundColor: "#020617",
  color: "#e5e7eb",
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
    case "secondary":
      return {
        ...base,
        backgroundColor: "#1d4ed8",
        color: "#e5e7eb",
      };
    case "danger":
      return {
        ...base,
        backgroundColor: "#dc2626",
        color: "#f9fafb",
      };
    default:
      return {
        ...base,
        backgroundColor: "transparent",
        border: "1px solid #4b5563",   
        color: "#e5e7eb",
      };
  }
}

  