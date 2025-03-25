import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi"

const StudentResult = () => {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/results");
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const filteredResults = results.filter((result: any) =>
    (result.student?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (result.exam?.name?.toLowerCase() || "").includes(search.toLowerCase())
  );
  

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Student Results</h2>
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300 overflow-x-auto">
      <div className="relative max-w-xs mb-3 float-right">
  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
  <input
    type="text"
    placeholder="Search"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="p-2 pl-10 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
  />
</div>

        <table className="w-full border-collapse min-w-[600px] border border-gray-200">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-300 p-3">Student Name</th>
              <th className="border border-gray-300 p-3">Exam</th>
              <th className="border border-gray-300 p-3">Marks</th>
              <th className="border border-gray-300 p-3">CGPA</th>
              <th className="border border-gray-300 p-3">Result Date</th>
              <th className="border border-gray-300 p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length > 0 ? (
              filteredResults.map((result: any, index: number) => (
                <tr
                  key={result.id}
                  className={`text-center border-b border-gray-300 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-200 transition-all`}
                >
                  <td className="border border-gray-300 p-3 text-gray-900 font-semibold">
                    {result.student.name}
                  </td>
                  <td className="border border-gray-300 p-3 text-gray-800">
                    {result.exam.subject}
                  </td>
                  <td className="border border-gray-300 p-3 text-gray-800">
                    {result.marks}
                  </td>
                  <td className="border border-gray-300 p-3 text-gray-800">
                    {result.cgpa}
                  </td>
                  <td className="border border-gray-300 p-3 text-gray-700">
                    {new Date(result.result_Date).toDateString()}
                  </td>
                  <td
                    className={`border border-gray-300 p-3 font-bold ${
                      result.cgpa >= 2.5 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.cgpa >= 2.5 ? "Pass" : "Fail"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentResult;
