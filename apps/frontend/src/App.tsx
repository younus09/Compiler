import { Outlet } from "react-router";
import Navbar from "@/components/navbar/Navbar";

export function App() {
  return (
    <div className="bg-gray-400 h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
