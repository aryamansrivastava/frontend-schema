import { useState, useEffect } from "react";
import axios from "axios";

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/attendances")
      .then((response) => {
        setAttendanceData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err);
        setError("Failed to load attendance");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading attendance...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-gray-900">
      <h2 className="text-3xl font-bold mb-6">Attendance</h2>
      <ul>
        {attendanceData.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}
