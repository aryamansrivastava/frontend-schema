import { useState } from "react";
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
    if (!student || !student.id) return;

    setDroppedStudents((prev) => [...prev, student]);
    setStudents((prev) => prev.filter((s) => s.id !== student.id));
  };

  const handleReturn = (student: any) => {
    if (!student || !student.id) return;

    setStudents((prev) => [...prev, student]);
    setDroppedStudents((prev) => prev.filter((s) => s.id !== student.id));
  };

  const handleReorder = (list: any[], setList: any, dragIndex: number, hoverIndex: number) => {
    if (dragIndex < 0 || hoverIndex < 0 || dragIndex >= list.length || hoverIndex >= list.length) return;

    const updatedList = [...list];
    const [draggedStudent] = updatedList.splice(dragIndex, 1);
    updatedList.splice(hoverIndex, 0, draggedStudent);

    setList(updatedList);
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-md flex flex-col mb-12">
      <h2 className="text-2xl font-bold text-center mb-6 text-black">Drag & Drop Student Cards</h2>

      <div className="flex justify-between gap-6">
        <DropZone
          title="Students"
          students={students}
          onDrop={handleReturn} 
          onReorder={(dragIndex, hoverIndex) => handleReorder(students, setStudents, dragIndex, hoverIndex)}
          acceptType="DROPPED_STUDENT"
        />

        <DropZone
          title="Dropped Students"
          students={droppedStudents}
          onDrop={handleDrop} 
          onReorder={(dragIndex, hoverIndex) => handleReorder(droppedStudents, setDroppedStudents, dragIndex, hoverIndex)}
          acceptType="STUDENT"
        />
      </div>
    </div>
  );
};

export default DragDropBoard;
