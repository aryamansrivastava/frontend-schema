import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, CardContent } from "@mui/material";

interface Course {
  id: number;
  name: string;
  fees: number;
  duration: number;
  institute: string;
  studentCount: number;
  facultyCount: number;
}

export default function Courses() {
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
        Back
      </Button>

      <h2 className="text-2xl font-bold text-center text-gray-800 mt-6">
        Available Courses
      </h2>

      {loading ? (
        <p className="text-center text-gray-600 mt-4">Loading courses...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-4">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}/details`)}
              className="cursor-pointer hover:shadow-lg transition-transform transform hover:-translate-y-2 bg-white rounded-lg"
            >
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                <p className="text-sm text-gray-700 mt-2">
                  Fees: <strong>${course.fees}</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Duration: <strong>{course.duration} months</strong>
                </p>
                <div className="flex justify-between mt-3 text-sm text-gray-700">
                  <p>
                    Students: <strong>{course.studentCount}</strong>
                  </p>
                  <p>
                    Faculty: <strong>{course.facultyCount}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
