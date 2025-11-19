// frontend/src/pages/admin/AdminUsersPage.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const ROLES = ["CLIENTE", "EMPLEADO", "ADMIN"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/api/usuarios");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Error loading users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function changeRole(userId, newRole) {
    try {
      await axiosClient.put(`/api/usuarios/${userId}/rol`, null, {
        params: { rol: newRole },
      });
      await loadUsers();
    } catch (err) {
      console.error("Error changing role:", err);
      setError("Error changing user role.");
    }
  }

  async function toggleActive(user) {
    const newActive = !user.activo;
    try {
      await axiosClient.put(`/api/usuarios/${user.id}/activo`, null, {
        params: { activo: newActive },
      });
      await loadUsers();
    } catch (err) {
      console.error("Error updating active state:", err);
      setError("Error updating user state.");
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
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        Manage Users
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
        <p style={{ fontSize: "0.95rem" }}>
          Total users: <strong>{users.length}</strong>
        </p>

        <button
          onClick={loadUsers}
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
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
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
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Active</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: "1px solid #111827",
                    backgroundColor: u.activo ? "#020617" : "#111827",
                  }}
                >
                  <td style={tdStyle}>{u.nombreCompleto}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.telefono || "-"}</td>
                  <td style={tdStyle}>
                    <select
                      value={u.rol}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.375rem",
                        border: "1px solid #4b5563",
                        backgroundColor: "#020617",
                        color: "#e5e7eb",
                        fontSize: "0.85rem",
                      }}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={tdStyle}>{u.activo ? "Yes" : "No"}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => toggleActive(u)}
                      style={btnSmall(
                        u.activo ? "danger" : "success"
                      )}
                    >
                      {u.activo ? "Deactivate" : "Activate"}
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
    default:
      return {
        ...base,
        backgroundColor: "transparent",
        border: "1px solid #4b5563",
        color: "#e5e7eb",
      };
  }
}
