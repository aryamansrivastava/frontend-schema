import React from "react";
import { useDrag, useDrop } from "react-dnd";

const DraggableStudent = ({
  student,
  index,
  onReorder,
  fromDropped,
}: {
  student: any;
  index: number;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  fromDropped: boolean;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: fromDropped ? "DROPPED_STUDENT" : "STUDENT",
    item: { ...student, index }, 
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: fromDropped ? "DROPPED_STUDENT" : "STUDENT",
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        onReorder(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const ref = React.useRef<HTMLDivElement>(null);
  drag(drop(ref)); 

  return (
    <div
      ref={ref}
      className={`p-3 bg-white shadow-md rounded-lg border cursor-pointer transition-all ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <p className="font-semibold">{index + 1}. {student.name}</p>
      <p className="text-sm text-gray-600">Marks: {student.marks}</p>
    </div>
  );
};

export default DraggableStudent;
