import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Courses() {
  interface Course {
    id: number;
    name: string;
    fees: number;
    duration: number; 
  }

  const { instituteId } = useParams<{ instituteId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/courses/institutes/${instituteId}`)
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
        setLoading(false);
      });
  }, [instituteId]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md text-gray-900">
      <button
        className="mb-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
  
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Available Courses</h2>
  
      {loading ? (
        <p className="text-center text-gray-600">Loading courses...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-6 bg-white rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105 hover:shadow-lg border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-blue-600">{course.name}</h3>
              <p className="text-gray-700 mt-2">
                Fees: <span className="font-bold">{course.fees}</span>
              </p>
              <p className="text-gray-700">
                Duration: <span className="font-bold">{course.duration} months</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No courses found</p>
      )}
    </div>
  );
}  