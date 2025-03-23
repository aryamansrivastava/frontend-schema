// import { useEffect, useState } from "react";

// type Student = {
//   id: number;
//   name: string;
//   email: string;
// };

// const StudentList = ({ courseId }: { courseId: number }) => {
//   const [students, setStudents] = useState<Student[]>([]);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/courses/${courseId}/students`)
//       .then((res) => res.json())
//       .then((data) => setStudents(data))
//       .catch((err) => console.error("Error fetching students:", err));
//   }, [courseId]);

//   return (
//     <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-semibold text-white mb-4">Students</h2>
//       <ul className="space-y-4">
//         {students.map((student) => (
//           <li key={student.id} className="p-4 bg-gray-700 rounded-md">
//             <h3 className="text-lg font-bold text-purple-300">{student.name}</h3>
//             <p className="text-gray-300"> Email: {student.email}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default StudentList;
