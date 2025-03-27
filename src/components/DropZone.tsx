import React from "react";
import { useDrop } from "react-dnd";
import DraggableStudent from "./DraggableStudent";

const DropZone = ({
  title,
  students = [],
  onDrop,
  onReorder,
  acceptType,
}: {
  title: string;
  students: any[];
  onDrop: (student: any, newIndex: number) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  acceptType: string;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: acceptType,
    drop: (item: any) => {
      if (students) {
        const newIndex = students.length; 
        onDrop(item, newIndex);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const dropRef = React.useRef<HTMLDivElement>(null);
  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`text-black w-1/2 p-4 rounded-lg shadow-md min-h-[200px] transition-all ${
        isOver ? "bg-blue-100 border-2 border-blue-500" : "bg-gray-300"
      }`}
    >
      <h3 className="font-bold mb-3 text-lg text-black">{title}</h3>
      {students.length > 0 ? (
        students.map((student, index) => (
          student && (
            <DraggableStudent
              key={student.id}
              student={student}
              index={index}
              onReorder={onReorder}
              fromDropped={acceptType === "STUDENT"}
            />
          )
        ))
      ) : (
        <p className="text-gray-500 text-sm">Drop students here</p>
      )}
    </div>
  );
};

export default DropZone;
