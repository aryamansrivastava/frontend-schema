import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Institute from "./components/Institute";
import Courses from "./components/Courses";
import Attendance from "./components/Attendance";
import Result from "./components/Result";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/institutes" element={<Institute />} />
      <Route path="/courses/:instituteId" element={<Courses />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/results" element={<Result />} />
    </Routes>
  );
}
