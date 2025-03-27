import { useState } from "react";
import DraggableStudent from "./DraggableStudent";
import DropZone from "./DropZone";

const initialStudents = [
  { id: "1", name: "Alice Johnson", marks: 85 },
  { id: "2", name: "Bob Smith", marks: 78 },
  { id: "3", name: "Charlie Brown", marks: 92 },
];

const DragDropBoard = () => {
  const [students, setStudents] = useState(initialStudents);
  const [droppedStudents, setDroppedStudents] = useState<any[]>([]);

  const handleDrop = (student: any) => {
    setDroppedStudents((prev) => [...prev, student]);
    setStudents((prev) => prev.filter((s) => s.id !== student.id));
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-md flex flex-col">
      <h2 className="text-2xl font-bold text-center mb-6 text-black">Drag & Drop Student Cards</h2>

      <div className="flex justify-between gap-6">
        <div className="w-1/2 bg-gray-200 p-4 rounded-lg shadow-md">
          <h3 className="font-bold mb-3 text-lg text-black">Students</h3>
          <div className="space-y-3 text-black">
            {students.length > 0 ? (
              students.map((student) => (
                <DraggableStudent key={student.id} student={student} />
              ))
            ) : (
              <p className="text-gray-500 text-sm">No students left</p>
            )}
          </div>
        </div>

        <DropZone onDrop={handleDrop} droppedStudents={droppedStudents} />
      </div>
    </div>
  );
};

export default DragDropBoard;
