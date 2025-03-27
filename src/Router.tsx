import { Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Dashboard from "./components/Dashboard";
import Institute from "./components/Institute";
import Courses from "./components/Courses";
import Attendance from "./components/Attendance";
import Result from "./components/Result";
import DragDropBoard from "./components/DragDropBoard";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/institutes" element={<Institute />} />
      <Route path="/courses/institutes/:instituteId" element={<Courses />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/results" element={<Result />} /> 
      <Route
        path="/drag-drop"
        element={
          <DndProvider backend={HTML5Backend}>
            <DragDropBoard />
          </DndProvider>
        }
      />
    </Routes>
  );
}
