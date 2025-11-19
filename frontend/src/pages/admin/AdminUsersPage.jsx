import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient.js";

export default function AdminUsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Users</h1>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && usuarios.length === 0 && (
        <p>No users found.</p>
      )}

      {!loading && !error && usuarios.length > 0 && (
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
                Name
              </th>
              <th style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                Email
              </th>
              <th style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                Role
              </th>
              <th style={{ borderBottom: "1px solid #1f2937", padding: "0.5rem" }}>
                Active
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td
                  style={{
                    borderBottom: "1px solid #1f2937",
                    padding: "0.5rem",
                  }}
                >
                  {u.nombreCompleto}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #1f2937",
                    padding: "0.5rem",
                  }}
                >
                  {u.email}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #1f2937",
                    padding: "0.5rem",
                  }}
                >
                  {u.rol}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #1f2937",
                    padding: "0.5rem",
                  }}
                >
                  {u.activo ? "YES" : "NO"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
