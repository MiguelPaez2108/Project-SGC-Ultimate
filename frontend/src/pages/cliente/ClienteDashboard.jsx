import { useAuth } from "../../hooks/useAuth.js";

export default function ClienteDashboard() {
  const { userId, role } = useAuth();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Client Dashboard</h1>
      <p>Role: {role}</p>
      <p>User ID: {userId}</p>
      <p>Here you will see your reservations, available fields, etc.</p>
    </main>
  );
}
