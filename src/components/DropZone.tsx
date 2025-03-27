import React from "react";
import { useDrop } from "react-dnd";

const DropZone = ({ onDrop, droppedStudents }: { onDrop: (item: any) => void; droppedStudents: any[] }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "STUDENT",
    drop: (item: any) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const dropRef = React.useRef<HTMLDivElement>(null);
  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`w-1/2 p-4 rounded-lg shadow-md min-h-[200px] transition-all ${
        isOver ? "bg-blue-100 border-2 border-blue-500" : "bg-gray-300"
      }`}
    >
      <h3 className="font-bold mb-3 text-lg text-black">Dropped Students</h3>
      {droppedStudents.length > 0 ? (
        droppedStudents.map((student) => (
          <div key={student.id} className="p-3 bg-white shadow-md rounded-lg border mb-2 text-black">
            <p className="font-semibold">{student.name}</p>
            <p className="text-sm text-gray-600">Marks: {student.marks}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">Drop students here</p>
      )}
    </div>
  );
};

export default DropZone;
