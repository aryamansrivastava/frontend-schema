import React from "react";
import { useDrag } from "react-dnd";

const DraggableStudent = ({ student }: { student: any }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "STUDENT",
    item: student,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const ref = React.useRef<HTMLDivElement>(null);
  drag(ref);

  return (
    <div
      ref={ref}
      className={`p-3 bg-white shadow-md rounded-lg border cursor-pointer transition-all ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <p className="font-semibold">{student.name}</p>
      <p className="text-sm text-gray-600">Marks: {student.marks}</p>
    </div>
  );
};

export default DraggableStudent;
