import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AppRouter from "./Router";

export default function App() {
  return (
    <Router>
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar/>
      <main className="flex-1 p-6 bg-gray-100">
        <AppRouter />
      </main>
    </div>
  </Router>
  
  );
}
