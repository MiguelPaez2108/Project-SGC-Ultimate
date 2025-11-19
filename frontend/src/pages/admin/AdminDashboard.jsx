import { useAuth } from "../../hooks/useAuth.jsx";

export default function AdminDashboard() {
  const { userId, role } = useAuth();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      <p>Role: {role}</p>
      <p>User ID: {userId}</p>
      <p>Here you will manage fields, schedules, reservations and payments.</p>
    </main>
  );
}
