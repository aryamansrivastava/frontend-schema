import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Institute from "./components/Institute";
import Courses from "./components/Courses";
import Attendance from "./components/Attendance";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/institutes" element={<Institute />} />
      <Route path="/courses/:instituteId" element={<Courses />} />
      <Route path="/attendance" element={<Attendance />} />
    </Routes>
  );
}
