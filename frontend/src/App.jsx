import AppRouter from "./router/AppRouter.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020617", color: "white" }}>
      <Navbar />
      <AppRouter />
    </div>
  );
}
