import { useEffect, useState } from "react";
import axios from "axios";
import Graph from "./Graph";

const Dashboard = () => {
  const [totalStudentsToday, setTotalStudentsToday] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalFacultyToday, setTotalFacultyToday] = useState<number>(0);

  useEffect(() => {
    // fetchTotalStudentsToday();
    fetchTotalStudents();
    fetchTotalFacultyToday();
  }, []);

  const fetchTotalStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      setTotalStudents(response.data.total);
    } catch (error) {
      console.error("Error fetching total students:", error);
    }
  };

  const fetchTotalFacultyToday = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/faculties");
      setTotalFacultyToday(response.data.length);
    } catch (error) {
      console.error("Error fetching total faculty today:", error);
    }
  };

  const chartData = [
    { category: "Total Students", value: totalStudents },
    { category: "Total Faculties", value: totalFacultyToday },
  ];

  return (
    <div className="dashboard flex h-screen">
      <main className="flex-1 p-6 bg-gray-100">
  <header className="bg-white p-4 shadow-md rounded-md mb-4 border border-gray-200">
    <h2 className="text-xl font-bold text-gray-800">Welcome</h2>
    <p className="text-gray-600">Today's Date: {new Date().toDateString()}</p>
  </header>

  <section className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Total Faculty Present Today</h3>
            <p className="text-2xl font-bold">{totalFacultyToday}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Total Students Present Today</h3>
            <p className="text-2xl font-bold">{totalStudents}</p>
          </div>
        </section>

  <section className="bg-white p-4 rounded-md shadow-md border border-gray-200">
    <h3 className="text-lg font-bold mb-3 text-gray-800">Student Statistics</h3>
    <Graph chartData={chartData} />
  </section>
</main>

    </div>
  );
};

export default Dashboard;