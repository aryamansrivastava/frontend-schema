import { useEffect, useState } from "react";
import axios from "axios";
import Graph from "./Graph";

interface Institute {
  id: number;
  name: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  course?: {
    name: string;
  };
}

interface Faculty {
  id: number;
  name: string;
  email: string;
  qualification: string;
}

const Dashboard = ({ initialInstituteId }: { initialInstituteId?: number }) => {
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalFacultyToday, setTotalFacultyToday] = useState<number>(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [instituteId, setInstituteId] = useState<number | undefined>(
    initialInstituteId
  );
  const [instituteName, setInstituteName] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    fetchInstitutes();
  }, []);

  useEffect(() => {
    if (instituteId) {
      fetchData();
    } else {
      fetchTotalStudents();
      fetchTotalFaculty();
    }
  }, [instituteId]);

  const fetchInstitutes = async () => {
    try {
      let allInstitutes: Institute[] = [];
      let page = 1;
      let totalPages = 1; 
  
      while (page <= totalPages) {
        const response = await axios.get("http://localhost:5000/api/institutes", {
          params: { page, limit: 100 } 
        });
  
        const institutesData = response.data.data || [];
        allInstitutes = allInstitutes.concat(institutesData);
  
        totalPages = response.data.totalPages;
        page++; 
      }
  
      setInstitutes(allInstitutes); 
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  };

  const handleInstituteChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = Number(event.target.value);
    setInstituteId(id);
    const name = institutes?.find((i) => i.id == id)?.name;
    setInstituteName(name);
    console.log("institute id changed");
    setError(null);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [studentsResponse, facultyResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/students/${instituteId}`),
        axios.get(`http://localhost:5000/api/faculties/${instituteId}`),
      ]);

      console.log(studentsResponse, facultyResponse);

      setStudents(studentsResponse.data.students);
      setFaculty(facultyResponse.data);
      setTotalStudents(studentsResponse.data.total);
      setTotalFacultyToday(facultyResponse.data.totalFaculty);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchTotalStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/students/count"
      );
      setTotalStudents(response.data.data.total);
    } catch (error) {
      console.error("Error fetching total students:", error);
    }
  };

  const fetchTotalFaculty = async () => {
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
    <div className="dashboard flex h-full">
      <main className="flex-1 p-2 bg-gray-100">
        <header className="bg-white p-4 rounded-md mb-4 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Welcome</h2>
              <p className="text-gray-600">
                Today's Date: {new Date().toDateString()}
              </p>
            </div>
            <div className="mt-3 md:mt-0 flex items-center gap-2">
              <select
                value={instituteId || ""}
                onChange={handleInstituteChange}
                className="border border-gray-300 p-2 rounded-md text-black"
              >
                <option value="" disabled>
                  {institutes.length === 0
                    ? "No Institutes Available"
                    : "Select Institute"}
                </option>
                {institutes.map((institute) => (
                  <option key={institute.id} value={institute.id}>
                    {institute.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          {instituteId ? (
            <div className="mt-2 text-sm text-blue-600">
              Showing data for {instituteName}
            </div>
          ) : (
            <div className="mt-2 text-sm text-blue-600">
              Showing data for All Institutes
            </div>
          )}
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white text-blue-500 p-6 rounded-lg text-center border-2">
            <h3 className="text-2xl font-bold">{totalFacultyToday}</h3>
            <p className="font-semibold text-black text-sm">
              {instituteId
                ? "Faculty at Institute"
                : "Total Faculty Present Today"}
            </p>
          </div>
          <div className="bg-white text-green-500 p-6 rounded-lg text-center border-2">
            <h3 className="text-2xl font-bold">{totalStudents}</h3>
            <p className="font-semibold text-sm text-black">
              {instituteId
                ? "Students at Institute"
                : "Total Students Present Today"}
            </p>
          </div>
        </section>

        <section className="bg-white p-4 rounded-md border border-gray-200">
          <h3 className="text-lg font-bold mb-3 text-gray-800">
            Student And Faculty Count {instituteName && `for ${instituteName}`}
          </h3>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading data...</p>
            </div>
          ) : (
            <Graph chartData={chartData} />
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;