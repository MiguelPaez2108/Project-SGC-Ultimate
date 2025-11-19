// frontend/src/pages/admin/AdminFieldsPage.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const TIPOS_CANCHA = [
  "FUTBOL_11",
  "FUTBOL_8",
  "FUTBOL_7",
  "FUTBOL_5",
];

export default function AdminFieldsPage() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // formulario
  const [editingId, setEditingId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("FUTBOL_11");
  const [ubicacion, setUbicacion] = useState("");
  const [precioPorHora, setPrecioPorHora] = useState("");
  const [techada, setTechada] = useState(false);

  // ========== Helpers ==========

  function resetForm() {
    setEditingId(null);
    setNombre("");
    setTipo("FUTBOL_11");
    setUbicacion("");
    setPrecioPorHora("");
    setTechada(false);
    setError("");
  }

  async function loadFields() {
    setLoading(true);
    setError("");

    try {
      const res = await axiosClient.get("/api/canchas");
      setFields(res.data);
    } catch (err) {
      console.error("Error loading fields:", err);
      setError("Error loading fields from server.");
    } finally {
      setLoading(false);
    }
  }

  // ========== Efecto inicial ==========

  useEffect(() => {
    loadFields();
  }, []);

  // ========== Handlers ==========

  function handleEditClick(field) {
    setEditingId(field.id);
    setNombre(field.nombre || "");
    setTipo(field.tipo || "FUTBOL_11");
    setUbicacion(field.ubicacion || "");
    setPrecioPorHora(field.precioPorHora || "");
    setTechada(Boolean(field.techada));
    setError("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this field?")) return;

    try {
      await axiosClient.delete(`/api/canchas/${id}`);
      await loadFields();
    } catch (err) {
      console.error("Error deleting field:", err);
      setError("Error deleting field.");
    }
  }

  async function handleToggleEstado(field) {
    try {
      const nuevoEstado = field.estado === "ACTIVA" ? "INACTIVA" : "ACTIVA";

      await axiosClient.put(`/api/canchas/${field.id}`, {
        ...field,
        estado: nuevoEstado,
      });

      await loadFields();
    } catch (err) {
      console.error("Error updating field status:", err);
      setError("Error updating field status.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!nombre.trim()) {
      setError("Name is required.");
      setSaving(false);
      return;
    }
    if (!precioPorHora || Number(precioPorHora) <= 0) {
      setError("Price per hour must be greater than 0.");
      setSaving(false);
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      tipo,
      ubicacion: ubicacion.trim() || null,
      precioPorHora: Number(precioPorHora),
      estado: "ACTIVA",
      techada,
    };

    try {
      if (editingId) {
        // update
        await axiosClient.put(`/api/canchas/${editingId}`, payload);
      } else {
        // create
        await axiosClient.post("/api/canchas", payload);
      }

      await loadFields();
      resetForm();
    } catch (err) {
      console.error("Error saving field:", err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(`Error: ${err.response.data.message}`);
      } else {
        setError("Unexpected error while saving field.");
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
        Manage Fields
      </h1>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.2fr)",
          gap: "2rem",
          alignItems: "flex-start",
        }}
      >
        {/* ======== Tabla de canchas ======== */}
        <div>
          <h2 style={{ marginBottom: "0.75rem" }}>Existing fields</h2>

          {loading ? (
            <p>Loading fields...</p>
          ) : fields.length === 0 ? (
            <p>No fields created yet.</p>
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
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Location</th>
                    <th style={thStyle}>Price/h</th>
                    <th style={thStyle}>Roofed</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((f) => (
                    <tr
                      key={f.id}
                      style={{
                        borderBottom: "1px solid #111827",
                        backgroundColor:
                          f.estado === "ACTIVA" ? "#020617" : "#111827",
                      }}
                    >
                      <td style={tdStyle}>{f.nombre}</td>
                      <td style={tdStyle}>{f.tipo}</td>
                      <td style={tdStyle}>{f.ubicacion || "-"}</td>
                      <td style={tdStyle}>${f.precioPorHora}</td>
                      <td style={tdStyle}>{f.techada ? "Yes" : "No"}</td>
                      <td style={tdStyle}>{f.estado}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleEditClick(f)}
                          style={btnSmall("secondary")}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleEstado(f)}
                          style={btnSmall(
                            f.estado === "ACTIVA" ? "danger" : "success"
                          )}
                        >
                          {f.estado === "ACTIVA" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
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
        </div>

        {/* ======== Formulario crear/editar ======== */}
        <div
          style={{
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            padding: "1.5rem",
            backgroundColor: "#020617",
          }}
        >
          <h2 style={{ marginBottom: "0.75rem" }}>
            {editingId ? "Edit field" : "Create new field"}
          </h2>

          {error && (
            <p style={{ color: "#f97373", marginBottom: "0.75rem" }}>{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{ display: "block", marginBottom: "0.25rem" }}
                htmlFor="nombre"
              >
                Name
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{ display: "block", marginBottom: "0.25rem" }}
                htmlFor="tipo"
              >
                Type
              </label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={inputStyle}
              >
                {TIPOS_CANCHA.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{ display: "block", marginBottom: "0.25rem" }}
                htmlFor="ubicacion"
              >
                Location (optional)
              </label>
              <input
                id="ubicacion"
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{ display: "block", marginBottom: "0.25rem" }}
                htmlFor="precio"
              >
                Price per hour (COP)
              </label>
              <input
                id="precio"
                type="number"
                min="0"
                step="1000"
                value={precioPorHora}
                onChange={(e) => setPrecioPorHora(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={techada}
                  onChange={(e) => setTechada(e.target.checked)}
                  style={{ marginRight: "0.5rem" }}
                />
                Roofed field
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
                  : "Create field"}
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

// ======== estilos auxiliares ========
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
    case "success":
      return {
        ...base,
        backgroundColor: "#16a34a",
        color: "#0b1120",
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
