import { Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Dashboard from "./components/Dashboard";
import Institute from "./components/Institute";
import Courses from "./components/Courses";
import Attendance from "./components/Attendance";
import Result from "./components/Result";
import DragDropBoard from "./components/DragDropBoard";
import CourseDetails from "./components/CourseDetails";
import ExcelParser from "./components/ExcelParser";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/institutes" element={<Institute />} />
      <Route path="/courses/institutes/:instituteId" element={<Courses />} />
      <Route path="/courses/:courseId/details" element={<CourseDetails />} />
      <Route path="/attendance" element={<Attendance instituteId={1} />} />
      <Route path="/results" element={<Result />} />
      <Route
        path="/drag-drop"
        element={
          <div className="flex justify-center items-center min-h-screen px-4">
            <DndProvider backend={HTML5Backend}>
              <div className="w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto">
                <DragDropBoard />
              </div>
            </DndProvider>
          </div>
        }
      />
      <Route path="/excel-parser" element={<ExcelParser />} />
    </Routes>
  );
}